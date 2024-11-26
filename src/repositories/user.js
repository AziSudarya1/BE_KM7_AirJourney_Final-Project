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

export async function verifyUser(userId) {
  return await prisma.user.update({
    where: { id: userId },
    data: { verified: true }
  });
}
