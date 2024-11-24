import { prisma } from '../utils/db.js';

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data
  });
};

export const updateUserVerification = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { verified: true }
  });
};
