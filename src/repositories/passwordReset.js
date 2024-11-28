import { prisma } from '../utils/db.js';

export async function getActiveTokenWithUser(token) {
  return prisma.passwordReset.findFirst({
    where: {
      token,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });
}
