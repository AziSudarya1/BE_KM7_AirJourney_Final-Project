import * as flightService from '../services/flight.js';

export async function createFlight(req, res) {
  const payload = req.body;

  const aeroplane = await flightService.validateCreateFlightIdAndGetAeroplane(
    payload.airportIdFrom,
    payload.airportIdTo,
    payload.aeroplaneId,
    payload.airlineId
  );

  const data = await flightService.createFlightAndSeat(payload, aeroplane);

  return res.status(201).json({
    message: 'Successfully create flight',
    data
  });
}
