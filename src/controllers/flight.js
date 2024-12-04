import * as flightService from '../services/flight.js';

export async function createFlight(req, res) {
  const payload = req.body;
  const aeroplane = res.locals.aeroplane;

  await flightService.validateCreateFlightIdAndGetAeroplane(
    payload.airportIdFrom,
    payload.airportIdTo,
    payload.airlineId
  );

  const data = await flightService.createFlightAndSeat(payload, aeroplane);

  return res.status(201).json({
    message: 'Successfully create flight',
    data
  });
}

export async function getAllFlights(_req, res) {
  const filter = res.locals.filter;

  const data = await flightService.getAllFlight(filter);

  return res.json({
    message: 'Successfully get all flight',
    data
  });
}

export async function getFlightById(_req, res) {
  const data = res.locals.flight;

  return res.json({
    message: 'Successfully get flight',
    data
  });
}
