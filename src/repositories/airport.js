import { prisma } from '../utils/db';

export function createAirport(data) {
  return prisma.airport.create({
    data: {
      code: data.code,
      name: data.name,
      country: data.country,
      city: data.city
    }
  });
}
