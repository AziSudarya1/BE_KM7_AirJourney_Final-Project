import { prisma } from '../utils/db.js';

export async function updatePaymentStatusAndMethod(
  transactionId,
  status,
  method
) {
  return prisma.payment.update({
    where: { transactionId },
    data: {
      status,
      method,
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
      expiredAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
    }
  });
}
