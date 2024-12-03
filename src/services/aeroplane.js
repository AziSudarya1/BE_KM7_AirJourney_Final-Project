import * as aeroplaneRepository from '../repositories/aeroplane.js';

export async function createAeroplane(payload) {
  const aeroplaneData = await aeroplaneRepository.createAeroplane(payload);

  return aeroplaneData;
}

export async function getAeroplaneById(id) {
  const aeroplaneData = await aeroplaneRepository.getAeroplaneById(id);

  return aeroplaneData;
}

export async function getAeroplaneByNameOrCode(name, code) {
  const aeroplaneData = await aeroplaneRepository.getAeroplaneByNameOrCode(
    name,
    code
  );

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
