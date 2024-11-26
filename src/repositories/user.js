import { prisma } from '../utils/db.js';

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
}

export async function findUserByPhoneNumber(phoneNumber) {
  return await prisma.user.findUnique({
    where: {
      phoneNumber
    }
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data: {
      ...data,
      role: 'USER'
    }
  });
}

export async function updateUserVerification(userId, tx) {
  const db = tx ?? prisma;
  return await db.user.update({
    where: { id: userId },
    data: { verified: true }
  });
}
