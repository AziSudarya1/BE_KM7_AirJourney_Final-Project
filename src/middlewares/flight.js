import { HttpError } from '../utils/error.js';
import * as flightService from '../services/flight.js';

export async function checkFlightIdExist(req, res, next) {
  const { id } = req.params;
  const returnFlightId = req.query.returnFlightId;

  const departureFlight = await flightService.getDetailFlightById(id);

  if (!flight) {
    throw new HttpError('Flight not found', 404);
  }

  let returnFlight;

  if (returnFlightId) {
    const departureAirport = departureFlight.airportIdFrom;
    const arrivalAirport = departureFlight.airportIdTo;
    returnFlight = await flightService.getDetailFlightById(returnFlightId);

    if (!returnFlight) {
      throw new HttpError('Return flight not found', 404);
    }

    const validDepartureAirport = arrivalAirport === returnFlight.airportIdFrom;
    const validArrivalAirport = departureAirport === returnFlight.airportIdTo;

    if (!validDepartureAirport || !validArrivalAirport) {
      throw new HttpError(
        'Return flight must be the opposite of departure flight',
        400
      );
    }
  }

  res.locals.flight = {
    departureFlight,
    returnFlight
  };

  next();
}
