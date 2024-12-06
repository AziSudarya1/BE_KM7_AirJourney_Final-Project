import * as airportRepository from '../repositories/airport.js';

export async function createAirport(payload) {
  const data = await airportRepository.createAirport(payload);

  return data;
}

export async function getAirportById(id) {
  const data = await airportRepository.getAirportById(id);

  return data;
}

export async function getAirportByNameOrCode(name, code) {
  const data = await airportRepository.getAirportByNameOrCode(name, code);

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

export async function getAllAirports() {
  const data = await airportRepository.getAllAirports();

  return data;
}
