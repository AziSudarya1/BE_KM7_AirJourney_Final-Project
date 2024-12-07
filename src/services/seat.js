import * as seatRepository from '../repositories/seat.js';

export async function getSeatByIdAndFlightId(seatId, flightId) {
  const seat = await seatRepository.getSeatByIdAndFlightId(seatId, flightId);

  return seat;
}

export async function updateSeatStatus(seatId) {
  const seat = await seatRepository.updateSeatStatus(seatId);

  return seat;
}
