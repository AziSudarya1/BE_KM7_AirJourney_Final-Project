import { HttpError } from '../utils/error.js';
import * as airportService from '../services/airport.js';

export async function validateAirportId(req, _res, next) {
  const { airportIdFrom, airportIdTo } = req.body;

  if (airportIdFrom === airportIdTo) {
    throw new HttpError(
      'Departure and arrival airport cannot be the same',
      400
    );
  }

  const airportFrom = await airportService.getAirportById(airportIdFrom);
  const airportTo = await airportService.getAirportById(airportIdTo);

  if (!airportFrom || !airportTo) {
    throw new HttpError('Airport not found', 404);
  }

  next();
}
