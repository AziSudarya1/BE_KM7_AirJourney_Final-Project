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

export async function createPasswordResetTokenByUserId(
  userId,
  token,
  expiration
) {
  return prisma.passwordReset.create({
    data: {
      token,
      userId,
      expiredAt: expiration
    }
  });
}

export function getActiveTokenByUserId(userId) {
  return prisma.passwordReset.findFirst({
    where: {
      userId,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    }
  });
}
