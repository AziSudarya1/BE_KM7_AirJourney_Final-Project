import { HttpError } from '../utils/error.js';
import * as flightService from '../services/flight.js';

export async function checkFlightIdExist(req, res, next) {
  const { id } = req.params;
  const returnFlightId = req.query.returnFlightId;

  const departureFlight = await flightService.getDetailFlightById(id);

  if (!departureFlight) {
    throw new HttpError('Flight not found', 404);
  }

  let returnFlight;

  if (returnFlightId) {
    if (returnFlightId === id) {
      throw new HttpError(
        'Return flight must be different from departure flight',
        400
      );
    }

    const departureAirport = departureFlight.airportIdFrom;
    const arrivalAirport = departureFlight.airportIdTo;
    returnFlight = await flightService.getDetailFlightById(returnFlightId);

    if (!returnFlight) {
      throw new HttpError('Return flight not found', 404);
    }
    const validDepartureDate =
      new Date(departureFlight.arrivalDate) <
      new Date(returnFlight.departureDate);
    const validDepartureAirport = arrivalAirport === returnFlight.airportIdFrom;
    const validArrivalAirport = departureAirport === returnFlight.airportIdTo;

    if (!validDepartureDate) {
      throw new HttpError(
        'Return flight departure date must be after departure flight',
        400
      );
    }

    if (!validDepartureAirport || !validArrivalAirport) {
      throw new HttpError(
        'Return flight must be the opposite of departure flight',
        400
      );
    }
  }

  res.locals.flight = {
    departureFlight,
    ...(returnFlight && { returnFlight })
  };

  next();
}

export async function getMaxFlightDataAndCreateMeta(_req, res, next) {
  const filter = res.locals.filter;
  const page = res.locals.page;
  const favourite = res.locals.favourite;
  const meta = await flightService.countFlightDataWithFilterAndCreateMeta(
    filter,
    page,
    favourite
  );

  res.locals.meta = meta;

  next();
}
