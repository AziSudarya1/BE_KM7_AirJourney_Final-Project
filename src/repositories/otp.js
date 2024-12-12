import { prisma } from '../utils/db.js';

export function createOtp(userId, otp, expiredAt) {
  return prisma.otp.create({
    data: {
      userId,
      otp,
      expiredAt
    }
  });
}

export function findValidOtp(userId, otp) {
  return prisma.otp.findFirst({
    where: {
      userId,
      otp,
      used: false,
      expiredAt: { gt: new Date() }
    }
  });
}

export function findActiveOtp(userId) {
  return prisma.otp.findFirst({
    where: {
      userId,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    }
  });
}
