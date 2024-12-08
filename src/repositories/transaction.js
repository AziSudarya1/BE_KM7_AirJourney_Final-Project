import { prisma } from '../utils/db.js';

export function createTransactionAndPassenger(payload) {
  return prisma.transaction.create({
    data: {
      amount: payload.amount,
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload?.returnFlightId || null,
      Passenger: {
        createMany: {
          data: payload.passengers
        }
      },
      payment: {
        create: {
          status: 'PENDING'
        }
      }
    }
  });
}

export function getActiveTransaction(id) {
  return prisma.transaction.findFirst({
    where: {
      userId: id,
      payment: {
        status: {
          notIn: ['PENDING', 'SUCCESS']
        }
      }
    }
  });
}
