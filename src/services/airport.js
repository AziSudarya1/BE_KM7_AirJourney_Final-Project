import * as airportRepository from '../repositories/airport.js';

export async function createAirport(payload) {
  const data = await airportRepository.createAirport(payload);

  return data;
}

export async function getAirportById(id) {
  const data = await airportRepository.getAirportById(id);

  return data;
}

export async function getAirportByNameAndCode(name, code) {
  const data = await airportRepository.getAirportByNameAndCode(name, code);

  return data;
}

export async function updateAirport(id, payload) {
  const data = await airportRepository.updateAirport(id, payload);

  return data;
}

export async function deleteAirport(id) {
  const data = await airportRepository.deleteAirport(id);

  return data;
}
