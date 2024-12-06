import { prisma } from '../utils/db.js';

export function createAirport(payload) {
  return prisma.airport.create({
    data: {
      code: payload.code,
      name: payload.name,
      continent: payload.continent,
      city: payload.city,
      country: payload.country
    }
  });
}

export function getAirportById(id) {
  return prisma.airport.findUnique({
    where: {
      id
    }
  });
}

export function getAirportByName(name) {
  return prisma.airport.findUnique({
    where: {
      name
    }
  });
}

export function getAirportByCode(code) {
  return prisma.airport.findUnique({
    where: {
      code
    }
  });
}

export function updateAirport(id, payload) {
  return prisma.airport.update({
    where: {
      id
    },
    data: { ...payload }
  });
}

export function deleteAirport(id) {
  return prisma.airport.delete({
    where: {
      id
    }
  });
}
