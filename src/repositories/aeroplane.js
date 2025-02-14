import { prisma } from '../utils/db.js';

export function createAeroplane(payload) {
  return prisma.aeroplane.create({
    data: {
      name: payload.name,
      code: payload.code,
      type: payload.type,
      maxRow: payload.maxRow,
      maxColumn: payload.maxColumn
    }
  });
}

export function getAeroplaneById(id) {
  return prisma.aeroplane.findUnique({
    where: {
      id: id
    }
  });
}

export function getAeroplaneByName(name) {
  return prisma.aeroplane.findUnique({
    where: {
      name
    }
  });
}

export function getAeroplaneByCode(code) {
  return prisma.aeroplane.findUnique({
    where: {
      code
    }
  });
}

export function updateAeroplane(id, payload) {
  return prisma.aeroplane.update({
    where: { id },
    data: { ...payload }
  });
}

export function deleteAeroplane(id) {
  return prisma.aeroplane.delete({
    where: {
      id: id
    }
  });
}

export function getAllAeroplanes() {
  return prisma.aeroplane.findMany();
}
