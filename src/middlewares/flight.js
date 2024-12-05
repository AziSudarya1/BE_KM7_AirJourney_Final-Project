import { HttpError } from '../utils/error.js';
import * as flightService from '../services/flight.js';

export async function checkFlightIdExist(req, res, next) {
  const { id } = req.params;
  const flight = await flightService.getDetailFlightById(id);

  if (!flight) {
    throw new HttpError('Flight not found', 404);
  }

  res.locals.flight = flight;

  next();
}
