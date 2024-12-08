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
      Passenger: true,
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
      Passenger: true,
      payment: true
    }
  });
}

export function getAllTransactions() {
  return prisma.transaction.findMany({
    include: {
      Passenger: true,
      payment: true
    }
  });
}
