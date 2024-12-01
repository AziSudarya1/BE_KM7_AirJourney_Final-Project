import { prisma } from '../utils/db.js';

export function createAeroplane(payload) {
  return prisma.aeroplane.create({
    data: {
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

export function updateAeroplane(id, payload) {
  return prisma.aeroplane.update({
    where: {
      id: id
    },
    data: {
      code: payload.code,
      type: payload.type,
      maxRow: payload.maxRow,
      maxColumn: payload.maxColumn,
      updatedAt: new Date()
    }
  });
}

export function deleteAeroplane(id) {
  return prisma.aeroplane.delete({
    where: {
      id: id
    }
  });
}
