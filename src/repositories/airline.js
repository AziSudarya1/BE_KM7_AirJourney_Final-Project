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

export function getAirlineByName(name) {
  return prisma.airline.findFirst({
    where: {
      name
    }
  });
}

export function getAirlineByCode(code) {
  return prisma.airline.findUnique({
    where: {
      code
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
