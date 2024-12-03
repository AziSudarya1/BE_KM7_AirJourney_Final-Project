import { HttpError } from '../utils/error.js';
import * as airportService from '../services/airport.js';
import { generateSeats } from '../scripts/generateSeats.js';

export async function validateCreateFlightIdAndGetAeroplane(
  airportIdFrom,
  airportIdTo,
  airlineId
) {
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

  const airline = await airlineService.getAirlineById(airlineId);

  if (!airline) {
    throw new HttpError('Airline not found', 404);
  }
}

export async function createFlightAndSeat(payload, aeroplane) {
  const seats = generateSeats(
    aeroplane.maxRow,
    aeroplane.maxColumn,
    aeroplane.id
  );

  const flight = await flightRepository.createFlightAndSeat({
    ...payload,
    seats
  });

  return flight;
}
