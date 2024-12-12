import { prisma } from '../utils/db.js';

export async function updateStatus(transactionId, status) {
  return prisma.payment.update({
    where: { transactionId },
    data: {
      status,
      updatedAt: new Date()
    }
  });
}

export async function createPayment(payload, transaction) {
  return transaction.payment.create({
    data: {
      transactionId: payload.transactionId,
      status: 'PENDING',
      snapToken: payload.snapToken,
      snapRedirectUrl: payload.snapRedirectUrl
    }
  });
}
