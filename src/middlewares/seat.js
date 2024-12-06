import * as seatService from '../repositories/seat.js';
import { HttpError } from '../utils/error.js';

export async function checkSeatAvailability(req, res, next) {
  const { seatId, flightId } = req.body;

  const seat = await seatService.getSeatByIdAndFlightId(seatId, flightId);

  if (!seat) {
    throw new HttpError('Seat is not available', 400);
  }

  res.locals.seat = seat;

  next();
}
