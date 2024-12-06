import { prisma } from '../utils/db.js';

export function createTransactionAndPassenger(payload) {
  return prisma.transaction.create({
    data: {
      amount: payload.amount,
      status: 'UNPAID',
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload.returnFlightId || null,
      Passenger: {
        createMany: {
          data: payload.passengers
        }
      }
    }
  });
}

export function getBookingTransaction(id) {
  return prisma.transaction.findFirst({
    where: {
      userId: id,
      status: 'UNPAID'
    }
  });
}
