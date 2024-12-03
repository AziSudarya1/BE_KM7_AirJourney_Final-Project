import * as airlineServices from '../services/airline.js';
import { HttpError } from '../utils/error.js';

export async function checkAirlineCodeOrNameExist(req, res, next) {
  const { name, code } = req.body;
  const currentAirline = res.locals.airport;

  const skipUniqueCheck =
    currentAirline?.name === name && currentAirline?.code === code;

  if (!skipUniqueCheck) {
    const airline = await airlineServices.getAirlineByNameOrCode(name, code);

    if (airline) {
      throw new HttpError(
        'Airline with the same name and code already exists',
        409
      );
    }
  }

  next();
}

export async function checkAirlineById(req, res, next) {
  const { id } = req.params;

  const airline = await airlineServices.getAirlineById(id);

  if (!airline) {
    throw new HttpError('Airline data not found!', 404);
  }

  res.locals.airline = airline;

  next();
}
