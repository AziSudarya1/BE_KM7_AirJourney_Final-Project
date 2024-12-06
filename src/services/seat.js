import * as seatRepository from '../repositories/seat.js';
import { HttpError } from '../utils/error.js';

export async function getSeatByIdAndFlightId(seatId, flightId) {
  const seat = await seatRepository.getSeatByIdAndFlightId(seatId, flightId);

  if (!seat) {
    throw new HttpError('Seat not found', 400);
  }

  if (seat.status !== 'AVAILABLE') {
    throw new HttpError('Seat is not available', 400);
  }
  return seat;
}

export async function updateSeatStatus(seatId) {
  const seat = await seatRepository.updateSeatStatus(seatId);

  return seat;
}
