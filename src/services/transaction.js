import * as transactionRepository from '../repositories/transaction.js';
import crypto from 'crypto';
import { HttpError } from '../utils/error.js';

export async function createTransaction(
  userId,
  data,
  passengerData,
  seatData,
  transactionCode
) {
  const generateTransactionCode = crypto.randomUUID();

  if (!passengerData || !seatData || !data.departureFlightId) {
    throw new HttpError('Invalid flight, passenger, or seat data', 400);
  }

  const seatAvailability = await Promise.all(
    seatData.map(async (seat) => {
      return transactionRepository.checkSeatAvailability(seat.id);
    })
  );

  if (!seatAvailability.every((seat) => seat)) {
    throw new HttpError('One or more seats are not available');
  }

  const transaction = await transactionRepository.createTransaction(
    { transactionCode: generateTransactionCode },
    data,
    userId,
    seatData,
    passengerData
  );

  await markSeatsAsBooked(seatData);

  return transaction;
}

async function markSeatsAsBooked(seatData) {
  const updatePromises = seatData.map((seat) => {
    return transactionRepository.markSeatAsBooked(seat.id);
  });
  await Promise.all(updatePromises);
}
