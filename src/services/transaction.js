import * as transactionRepository from '../repositories/transaction.js';
import * as seatRepository from '../repositories/seat.js';
import * as flightService from '../services/flight.js';
import { prisma } from '../utils/db.js';
import { validatePassengers } from '../scripts/validatePassengers.js';
import { calculateAmount } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';
import * as paymentService from './payment.js';
import * as paymentRepository from '../repositories/payment.js';

export async function createTransaction(payload) {
  const existingTransaction = await transactionRepository.getActiveTransaction(
    payload.userId
  );

  if (existingTransaction) {
    throw new HttpError('User already has an active transaction', 400);
  }

  const departureFlight = await flightService.getFlightWithSeatsById(
    payload.departureFlightId
  );

  if (!departureFlight) {
    throw new HttpError('Departure Flight not found', 404);
  }

  const returnFlightId = payload.returnFlightId;

  let returnFlight = null;

  if (returnFlightId) {
    returnFlight = await flightService.getFlightWithSeatsById(returnFlightId);

    if (!returnFlight) {
      throw new HttpError('Return Flight not found', 404);
    }

    const departureAirport = departureFlight.airportIdFrom;
    const arrivalAirport = departureFlight.airportIdTo;
    const validDepartureAirport = arrivalAirport === returnFlight.airportIdFrom;
    const validArrivalAirport = departureAirport === returnFlight.airportIdTo;

    if (!validDepartureAirport || !validArrivalAirport) {
      throw new HttpError(
        'Return flight must be the opposite of departure flight',
        400
      );
    }
  }

  const invalidDepartureDate =
    new Date(departureFlight.departureDate) < new Date();

  const invalidDate =
    returnFlight &&
    new Date(departureFlight.arrivalDate) >
      new Date(returnFlight.departureDate);

  if (invalidDepartureDate) {
    throw new HttpError('Departure flight date cannot be in the past', 400);
  }

  if (invalidDate) {
    throw new HttpError(
      'Return flight date cannot be earlier than departure flight date',
      400
    );
  }

  const passengers = payload.passengers;
  const departurePrice = departureFlight.price;
  const returnPrice = returnFlight?.price || 0;
  const departureSeats = departureFlight.seat;
  const returnSeats = returnFlight?.seat;

  const { seatIds, proccessedPassengers } = await validatePassengers(
    passengers,
    returnFlight,
    departureSeats,
    returnSeats
  );

  const amount = calculateAmount(
    passengers,
    departurePrice,
    returnPrice,
    returnFlightId
  );

  const tax = Math.round(amount * 0.1);
  const total = amount + tax;

  const transactionData = await prisma.$transaction(async (transaction) => {
    await seatRepository.updateSeatStatusBySeats(
      seatIds,
      'PENDING',
      transaction
    );

    const data = await transactionRepository.createTransactionAndPassenger(
      {
        amount: total,
        userId: payload.userId,
        departureFlightId: payload.departureFlightId,
        returnFlightId: returnFlightId,
        proccessedPassengers
      },
      transaction
    );

    const midtrans = await paymentService.createMidtransToken(data);

    const payment = await paymentRepository.createPayment(
      {
        transactionId: data.id,
        snapToken: midtrans.token
      },
      transaction
    );

    return {
      ...data,
      payment
    };
  });

  return transactionData;
}

export async function getDetailTransactionById(id) {
  const data = await transactionRepository.getDetailTransactionById(id);

  const passengers = data?.passenger;
  const departurePrice = data.departureFlight.price;
  const returnPrice = data.returnFlight?.price || 0;
  const returnFlightId = data.returnFlight?.id || null;

  let totalPrice = 0;

  passengers.forEach((passenger) => {
    const passengerPrice = calculateAmount(
      [passenger],
      departurePrice,
      returnPrice,
      returnFlightId
    );
    passenger.totalPrice = passengerPrice;
    totalPrice += passengerPrice;
  });

  const tax = Math.round(totalPrice * 0.1);

  return {
    ...data,
    tax
  };
}

export async function getAllTransactions(userId, filter) {
  const data = await transactionRepository.getAllTransactions(userId, filter);

  return data;
}

export async function getTransactionWithUserById(id) {
  const data = await transactionRepository.getTransactionWithUserById(id);

  return data;
}
