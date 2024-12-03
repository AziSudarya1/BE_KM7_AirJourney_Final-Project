import * as airlineRepository from '../repositories/airline.js';

export async function createAirline(payload) {
  return await airlineRepository.createAirline(payload);
}

export async function getAirlineById(id) {
  return await airlineRepository.getAirlineById(id);
}

export async function getAirlineByNameOrCode(name, code) {
  return await airlineRepository.getAirlineByNameOrCode(name, code);
}

export async function updateAirlineById(id, payload) {
  return await airlineRepository.updateAirline(id, payload);
}

export async function deleteAirlineById(id) {
  return await airlineRepository.deleteAirline(id);
}
