import { prisma } from '../utils/db.js';

export function updatePaymentStatusAndMethod(transactionId, payload, tx) {
  const db = tx ?? prisma;

  return db.payment.update({
    where: { transactionId },
    data: {
      ...payload
    }
  });
}

export function cancelAllPaymentByIds(ids, tx) {
  const db = tx ?? prisma;

  return db.payment.updateMany({
    where: {
      transactionId: {
        in: ids
      }
    },
    data: {
      status: 'CANCELLED'
    }
  });
}

export function createPayment(payload, transaction) {
  return transaction.payment.create({
    data: {
      transactionId: payload.transactionId,
      status: 'PENDING',
      snapToken: payload.snapToken,
      expiredAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  });
}

export function getExpiredPaymentWithFlightAndPassenger() {
  return prisma.payment.findMany({
    where: {
      status: 'PENDING',
      expiredAt: {
        lte: new Date()
      }
    },
    include: {
      transaction: {
        include: {
          passenger: {
            select: {
              departureSeatId: true,
              returnSeatId: true
            }
          }
        }
      }
    }
  });
}
