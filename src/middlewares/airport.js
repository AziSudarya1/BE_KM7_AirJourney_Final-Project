import { HttpError } from '../utils/error.js';
import * as airportService from '../services/airport.js';

export async function checkAirportIdExist(req, res, next) {
  const { id } = req.params;

  const airport = await airportService.getAirportById(id);

  if (!airport) {
    throw new HttpError('Airport not found', 404);
  }

  res.locals.airport = airport;

  next();
}

export async function checkAirportCodeOrNameExist(req, res, next) {
  const { name, code } = req.body;

  const currentAirport = res.locals.airport;

  const skipUniqueCheckName = currentAirport?.name === name;

  if (name && !skipUniqueCheckName) {
    const airportName = await airportService.getAirportByName(name);

    if (airportName) {
      throw new HttpError('Airport with the same name already exists', 409);
    }
  }

  const skipUniqueCheckCode = currentAirport?.code === code;

  if (code && !skipUniqueCheckCode) {
    const airportCode = await airportService.getAirportByCode(code);

    if (airportCode) {
      throw new HttpError('Airport with the same code already exists', 409);
    }
  }

  next();
}
