import * as airlineServices from '../services/airline.js';
import { HttpError } from '../utils/error.js';

export async function checkAirlineById(req, res, next) {
  const { id } = req.params;

  const airline = await airlineServices.getAirlineById(id);

  if (!airline) {
    throw new HttpError('Airline data not found!', 404);
  }

  res.locals.airline = airline;

  next();
}

export async function checkAirlineCodeOrNameExist(req, res, next) {
  const { name, code } = req.body;

  const currentAirline = res.locals.airline;

  const skipUniqueCheckName = currentAirline?.name === name;

  if (name && !skipUniqueCheckName) {
    const airlineName = await airlineServices.getAirlineByName(name);

    if (airlineName) {
      throw new HttpError('Airline with the same name already exists', 409);
    }
  }

  const skipUniqueCheckCode = currentAirline?.code === code;

  if (code && !skipUniqueCheckCode) {
    const airlineCode = await airlineServices.getAirlineByCode(code);

    if (airlineCode) {
      throw new HttpError('Airline with the same code already exists', 409);
    }
  }

  next();
}
