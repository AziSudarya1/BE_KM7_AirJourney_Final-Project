import * as transactionRepository from '../repositories/transaction.js';
import * as seatRepository from '../repositories/seat.js';
import * as flightService from '../services/flight.js';
import { prisma } from '../utils/db.js';
import { validatePassengers } from '../scripts/validatePassengers.js';
import { calculateAmount } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';
import { sendEmail } from '../utils/email/mail.js';
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

export async function getDetailTransactionById(id, userId) {
  const data = await transactionRepository.getDetailTransactionById(id);

  if (!data) {
    throw new HttpError('Transaction not found', 404);
  }

  if (data.userId !== userId) {
    throw new HttpError('Unauthorized', 403);
  }

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

export async function getAllTransactions(userId, filter, meta) {
  const query = {
    skip: meta.skip,
    take: meta.limit,
    where: {
      userId
    },
    include: {
      payment: true,
      departureFlight: {
        include: {
          airportFrom: true,
          airportTo: true
        }
      },
      returnFlight: {
        include: {
          airportFrom: true,
          airportTo: true
        }
      }
    }
  };

  if (Object.keys(filter).length) {
    query.where = {
      ...query.where,
      ...filter
    };
  }

  const data = await transactionRepository.getAllTransactions(query);

  return data;
}

export async function getTransactionWithFlightAndPassenger(id, userId, email) {
  const transaction = await transactionRepository.getDetailTransactionById(id);

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  if (transaction.userId !== userId) {
    throw new HttpError('Unauthorized', 403);
  }

  if (transaction.payment.status !== 'SUCCESS') {
    throw new HttpError('Transaction incomplete cannot send e-ticket', 400);
  }

  const { departureFlight, returnFlight } = transaction;

  const passengers = [];
  transaction.passenger.forEach((p) => {
    passengers.push({
      title: p.title,
      firstName: p.firstName,
      familyName: p.familyName || '',
      type: p.type
    });
  });

  const ticket = {
    departureAirline: `${departureFlight.airline.name} (${departureFlight.airline.code})`,
    departureAeroplane: departureFlight.aeroplane.name,
    departureClass: departureFlight.class,
    departureDate: departureFlight.departureDate.toDateString(),
    departureTime: departureFlight.departureTime,
    arrivalTime: departureFlight.arrivalTime,
    duration: departureFlight.duration,
    departureAirportFromCity: departureFlight.airportFrom.city,
    arrivalAirportToCity: departureFlight.airportTo.city,
    departureAirportFromCode: departureFlight.airportFrom.code,
    arrivalAirportToCode: departureFlight.airportTo.code,
    departureAirportFromName: departureFlight.airportFrom.name,
    arrivalAirportToName: departureFlight.airportTo.name,

    returnFlight: returnFlight
      ? {
          returnAirline: `${returnFlight.airline.name} (${returnFlight.airline.code})`,
          returnAeroplane: returnFlight.aeroplane.name,
          returnClass: returnFlight.class,
          returnDate: returnFlight.departureDate.toDateString(),
          returnDepartureTime: returnFlight.departureTime,
          returnArrivalTime: returnFlight.arrivalTime,
          returnDuration: returnFlight.duration,
          returnairportFromCity: returnFlight.airportFrom.city,
          returnairportToCity: returnFlight.airportTo.city,
          returnairportFromCode: returnFlight.airportFrom.code,
          returnairportToCode: returnFlight.airportTo.code,
          returnairportFromName: returnFlight.airportFrom.name,
          returnairportToName: returnFlight.airportTo.name
        }
      : null,

    passengers: passengers
  };

  await sendEmail(email, 'Your E-Ticket', 'ticket', {
    ticket
  });

  return transaction;
}

export async function cancelTransaction(id, userId) {
  const transaction =
    await transactionRepository.getTransactionWithPassengerUserAndPaymentById(
      id
    );

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  if (transaction.userId !== userId) {
    throw new HttpError('Unauthorized', 403);
  }

  if (transaction.payment.status !== 'PENDING') {
    throw new HttpError('Transaction cannot be canceled', 400);
  }

  const seatIds = transaction.passenger.flatMap((p) => [
    p.departureSeatId,
    p.returnSeatId
  ]);

  const proccessedSeatIds = seatIds.filter((id) => id);

  await prisma.$transaction(async (transaction) => {
    await seatRepository.updateSeatStatusBySeats(
      proccessedSeatIds,
      'AVAILABLE',
      transaction
    );

    await paymentRepository.updatePaymentStatusAndMethod(
      id,
      {
        status: 'CANCELLED'
      },
      transaction
    );
  });
}

export async function countTransactionDataWithFilterAndCreateMeta(
  filter,
  page
) {
  const totalData =
    await transactionRepository.countTransactionDataWithFilter(filter);

  const limit = 10;

  let totalPage = 1;
  let skip = 0;

  if (totalData) {
    totalPage = Math.ceil(totalData / limit);

    if (page > totalPage) {
      throw new HttpError('Page not found', 404);
    }

    skip = (page - 1) * limit;
  }

  return {
    page,
    limit,
    totalPage,
    totalData,
    skip
  };
}
