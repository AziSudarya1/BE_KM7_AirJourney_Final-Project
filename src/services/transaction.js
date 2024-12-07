import * as transactionRepository from '../repositories/transaction.js';
import * as flightService from '../services/flight.js';
import { generatePassengers } from '../scripts/generatePassengers.js';
import { calculateAmount } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';

export async function createTransaction(payload) {
  const departureFlight = await flightService.getFlightById(
    payload.departureFlightId
  );

  let returnFlight = null;
  if (payload.returnFlightId) {
    returnFlight = await flightService.getFlightById(payload.returnFlightId);
  }

  if (!departureFlight) {
    throw new HttpError('Departure Flight not found', 404);
  }

  if (payload.returnFlightId && !returnFlight) {
    throw new HttpError('Return Flight not found', 404);
  }

  if (returnFlight && departureFlight.id === returnFlight.id) {
    throw new HttpError(
      'Departure flights and return flights cannot be the same',
      400
    );
  }

  if (
    returnFlight &&
    new Date(returnFlight.arrivalDate).getTime() <
      new Date(departureFlight.arrivalDate).getTime()
  ) {
    throw new HttpError(
      'Return flight date cannot be earlier than departure flight date',
      400
    );
  }

  if (
    payload.passengers.some(
      (passenger) => passenger.returnSeatId && !payload.returnFlightId
    )
  ) {
    throw new HttpError(
      'Return Flight is required when return seat is provided',
      400
    );
  }

  if (
    payload.returnFlightId &&
    payload.passengers.some((passenger) => !passenger.returnSeatId)
  ) {
    throw new HttpError('Return seat must be provided for return flight', 400);
  }

  const existingTransaction = await transactionRepository.getBookingTransaction(
    payload.userId
  );

  if (existingTransaction) {
    throw new HttpError('User already has an active transaction', 400);
  }

  const departurePrice = departureFlight.price;
  const returnPrice = returnFlight ? returnFlight.price : 0;

  const passengers = await generatePassengers(
    payload.passengers,
    departureFlight,
    returnFlight
  );

  const amount = calculateAmount(
    passengers,
    departurePrice,
    returnPrice,
    payload.returnFlightId
  );

  if (!payload.returnFlightId) {
    passengers.forEach((passenger) => {
      passenger.returnSeatId = null;
    });
  }

  const dataPassenger =
    await transactionRepository.createTransactionAndPassenger({
      amount,
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload.returnFlightId,
      passengers
    });

  return dataPassenger;
}
