import { prisma } from '../utils/db.js';

export async function createOtp(userId, otp, expiredAt) {
  return prisma.otp.create({
    data: {
      userId,
      otp,
      expiredAt
    }
  });
}

export async function findValidOtp(userId, otp) {
  return await prisma.otp.findFirst({
    where: {
      userId,
      otp,
      used: false,
      expiredAt: { gt: new Date() }
    }
  });
}

export async function findActiveOtp(userId) {
  return await prisma.otp.findFirst({
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
  return await tx.otp.update({
    where: {
      id: otpId
    },
    data: {
      used: true
    }
  });
}
