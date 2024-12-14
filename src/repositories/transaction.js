import { prisma } from '../utils/db.js';

export function createTransactionAndPassenger(payload, tx) {
  return tx.transaction.create({
    data: {
      amount: payload.amount,
      userId: payload.userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload?.returnFlightId || null,
      passenger: {
        createMany: {
          data: payload.proccessedPassengers
        }
      }
    },
    include: {
      user: true
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

export function getTransactionWithUserById(id) {
  return prisma.transaction.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
}

export function checkTransactionById(id) {
  return prisma.transaction.findUnique({
    where: {
      id
    },
    include: {
      payment: true
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
      payment: true,
      departureFlight: {
        include: {
          airportFrom: true,
          airportTo: true,
          airline: true,
          aeroplane: true
        }
      },
      returnFlight: {
        include: {
          airportFrom: true,
          airportTo: true,
          airline: true,
          aeroplane: true
        }
      }
    }
  });
}

export function getAllTransactions(userId, filter) {
  const query = {
    where: {
      userId
    },
    include: {
      payment: true,
      departureFlight: {
        include: {
          airportFrom: true,
          airportTo: true
        }
      },
      returnFlight: {
        include: {
          airportFrom: true,
          airportTo: true
        }
      }
    }
  };

  if (Object.keys(filter).length) {
    query.where = {
      ...query.where,
      ...filter
    };
  }

  return prisma.transaction.findMany(query);
}
