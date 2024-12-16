import * as airlineRepository from '../repositories/airline.js';

export async function createAirline(payload) {
  const data = await airlineRepository.createAirline(payload);

  return data;
}

export async function getAirlineById(id) {
  const data = await airlineRepository.getAirlineById(id);

  return data;
}

export async function getAirlineByName(name) {
  const data = await airlineRepository.getAirlineByName(name);

  return data;
}

export async function getAirlineByCode(code) {
  const data = await airlineRepository.getAirlineByCode(code);

  return data;
}

export async function getAllAirlines() {
  const data = await airlineRepository.getAllAirlines();

  return data;
}

export async function updateAirlineById(id, payload) {
  const data = await airlineRepository.updateAirline(id, payload);

  return data;
}

export async function deleteAirlineById(id) {
  const data = await airlineRepository.deleteAirline(id);

  return data;
}
