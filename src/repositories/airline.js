import { prisma } from '../utils/db.js';

export function createAirline(payload) {
  return prisma.airline.create({
    data: {
      name: payload.name,
      country: payload.country,
      fleetSize: payload.fleetSize
    }
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
  return prisma.airline.findUnique({
    where: {
      name
    }
  });
}

export function updateAirline(id, payload) {
  return prisma.airline.update({
    where: {
      id
    },
    data: {
      ...payload,
      updatedAt: new Date()
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
