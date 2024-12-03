import { HttpError } from '../utils/error.js';
import * as airportService from '../services/airport.js';

export async function checkAirportCodeAndNameExist(req, _res, next) {
  const { name, code } = req.body;

  const airport = await airportService.getAirportByNameAndCode(name, code);

  if (airport) {
    throw new HttpError(
      'Airport with the same name and code already exists',
      409
    );
  }

  next();
}

export async function checkAirportIdExist(req, _res, next) {
  const { id } = req.params;

  const airport = await airportService.getAirportById(id);

  if (!airport) {
    throw new HttpError('Airport not found', 404);
  }

  next();
}
