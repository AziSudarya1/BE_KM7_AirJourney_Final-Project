import { prisma } from '../utils/db.js';

export function createAirline(payload) {
  return prisma.airline.create({
    data: {
      code: payload.code,
      name: payload.name,
      image: payload.image
    }
  });
}


export function updateAirline(id, payload) {
  return prisma.airline.update({
    where: { id },
    data: { ...payload }
  });
}


export function getAirlineById(id) {
  return prisma.airline.findUnique({
    where: {
      id
    }
  });
}

export function getAirlineByNameOrCode(name, code) {
  return prisma.airline.findFirst({
    where: {
      OR: [{ name }, { code }]
    }
  });
}

export function deleteAirline(id) {
  return prisma.airline.delete({
    where: {
      id
    }
  });
}
