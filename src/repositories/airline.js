import { prisma } from '../utils/db.js';

export function getAirlineById(id) {
  return prisma.airline.findUnique({
    where: {
      id
    }
  });
}

export function getAllAirlines() {
  return prisma.airline.findMany();
}
