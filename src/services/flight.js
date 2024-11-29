import * as flightRepository from '../repositories/flight.js';

export async function createFlight(payload) {
  const data = await flightRepository.createFlight(payload);

  return data;
}
