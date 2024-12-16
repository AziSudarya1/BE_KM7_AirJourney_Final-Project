import { prisma } from '../utils/db.js';

export async function updatePaymentStatusAndMethod(transactionId, payload, tx) {
  const db = tx ?? prisma;

  return db.payment.update({
    where: { transactionId },
    data: {
      ...payload
    }
  });
}

export async function createPayment(payload, transaction) {
  return transaction.payment.create({
    data: {
      transactionId: payload.transactionId,
      status: 'PENDING',
      snapToken: payload.snapToken,
      expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
    }
  });
}
