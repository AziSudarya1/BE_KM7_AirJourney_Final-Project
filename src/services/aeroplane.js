import * as aeroplaneRepository from '../repositories/aeroplane.js';
import { HttpError } from '../utils/error.js';
import { randomUUID } from 'crypto';

export async function createAeroplane(payload) {
  const aeroplaneData = await aeroplaneRepository.createAeroplane(payload);

  return aeroplaneData;
}

export async function getAeroplaneById(id) {
  const aeroplaneData = await aeroplaneRepository.getAeroplaneById(id);

  return aeroplaneData;
}

export async function updateAeroplaneById(id, payload) {
  const aeroplaneData = await aeroplaneRepository.updateAeroplane(id, payload);

  return aeroplaneData;
}

export async function deleteAeroplaneById(id) {
  const aeroplaneData = await aeroplaneRepository.deleteAeroplane(id);

  return aeroplaneData;
}
