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
