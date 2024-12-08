import { prisma } from '../utils/db.js';

export function createTransactionAndPassenger(payload) {
  return prisma.transaction.create({
    data: {
      amount: payload.amount,
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload?.returnFlightId || null,
      passenger: {
        createMany: {
          data: payload.proccessedPassengers
        }
      },
      payment: {
        create: {
          status: 'PENDING'
        }
      }
    },
    include: {
      passenger: true,
      payment: true
    }
  });
}

export function getActiveTransaction(id) {
  return prisma.transaction.findFirst({
    where: {
      userId: id,
      payment: {
        status: {
          notIn: ['CANCELLED', 'SUCCESS']
        }
      }
    }
  });
}

export function getTransactionById(id) {
  return prisma.transaction.findUnique({
    where: {
      id
    },
    include: {
      passenger: true,
      payment: true
    }
  });
}

export function getAllTransactions(id) {
  return prisma.transaction.findMany({
    where: {
      userId: id
    },
    include: {
      passenger: true,
      payment: true
    }
  });
}
