import { prisma } from '../utils/db.js';

export async function createOtp(userId, otp, expiredAt) {
  return prisma.oTP.create({
    data: {
      userId,
      otp,
      expiredAt
    }
  });
}

export async function findValidOtp(userId, otp) {
  return await prisma.oTP.findFirst({
    where: {
      userId,
      otp,
      used: false,
      expiredAt: { gt: new Date() }
    }
  });
}

export async function findActiveOtp(userId) {
  return await prisma.oTP.findFirst({
    where: {
      userId,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    }
  });
}

export async function markOtpAsUsed(otpId, tx) {
  return await tx.oTP.update({
    where: {
      id: otpId
    },
    data: {
      used: true
    }
  });
}
