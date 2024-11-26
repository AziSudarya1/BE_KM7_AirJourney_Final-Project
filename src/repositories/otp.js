import { prisma } from '../utils/db.js';

export const createOtp = async (userId, otp, expiredAt) => {
  return prisma.oTP.create({
    data: {
      userId,
      otp,
      expiredAt
    }
  });
};

export const findValidOtp = async (userId, otp) => {
  return await prisma.oTP.findFirst({
    where: {
      userId,
      otp,
      used: false,
      expiredAt: { gt: new Date() }
    }
  });
};

export const findActiveOtp = async (userId) => {
  return await prisma.oTP.findFirst({
    where: {
      userId,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    }
  });
};

export const markOtpAsUsed = async (otpId) => {
  return await prisma.oTP.update({
    where: { id: otpId },
    data: { used: true }
  });
};
