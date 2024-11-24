import { prisma } from "../utils/db.js";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

export const saveOtp = async (userId, otpCode, expiredAt) => {
  return prisma.otp.create({
    data: {
      otp: otpCode,
      expiredAt,
      userId,
    },
  });
};
