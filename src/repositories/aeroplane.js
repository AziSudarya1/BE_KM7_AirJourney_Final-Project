import { prisma } from '../utils/db.js';

export function createAeroplane(data) {
  return prisma.aeroplane.create({
    data: {
      code: data.code,
      type: data.type,
      maxRow: data.maxRow,
      maxColumn: data.maxColumn
    }
  });
}
