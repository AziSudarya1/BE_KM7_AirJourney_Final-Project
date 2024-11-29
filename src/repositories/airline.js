import { prisma } from '../utils/db';

export function createAirline(data) {
  return prisma.airline.create({
    data: {
      code: data.code,
      name: data.name,
      image: data.image
    }
  });
}
