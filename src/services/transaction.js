import * as transactionRepository from '../repositories/transaction.js';
import * as seatRepository from '../repositories/seat.js';
import * as flightService from '../services/flight.js';
import { prisma } from '../utils/db.js';
import { validatePassengersSeats } from '../scripts/validatePassengerSeats.js';
import { calculateAmount } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';

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
  }

  const invalidDepartureDate =
    new Date(departureFlight.departureDate) < new Date();

  const invalidDate =
    returnFlight &&
    new Date(departureFlight.departureDate) >
      new Date(returnFlight.departureDate);

  if (invalidDate || invalidDepartureDate) {
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

  const { seatIds, proccessedPassengers } = await validatePassengersSeats(
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

  const transactionData = await prisma.$transaction(async (transaction) => {
    await seatRepository.updateSeatStatusBySeats(seatIds, transaction);

    const data = await transactionRepository.createTransactionAndPassenger({
      amount,
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: returnFlightId,
      proccessedPassengers
    });

    return data;
  });

  return transactionData;
}

export async function getTransactionById(id) {
  const data = await transactionRepository.getTransactionById(id);

  return data;
}

export async function getAllTransactions(userId, filter) {
  const data = await transactionRepository.getAllTransactions(userId, filter);

  return data;
}
