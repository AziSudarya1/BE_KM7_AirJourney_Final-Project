import * as airlineRepository from '../repositories/airline.js';

export async function getAirlineById(id) {
  const data = await airlineRepository.getAirlineById(id);

  return data;
}

export async function getAllAirlines() {
  const data = await airlineRepository.getAllAirlines();

  return data;
}
