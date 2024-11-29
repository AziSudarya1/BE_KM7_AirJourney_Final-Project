import { prisma } from '../utils/db.js';

export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export function findUserByPhoneNumber(phoneNumber) {
  return prisma.user.findUnique({
    where: {
      phoneNumber
    }
  });
}

export function createUser(data) {
  return prisma.user.create({
    data: {
      ...data,
      role: 'USER'
    }
  });
}

export function getUserWithId(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId
    }
  });
}

export function updateUserVerification(userId, tx) {
  const db = tx ?? prisma;
  return db.user.update({
    where: { id: userId },
    data: { verified: true }
  });
}

export async function updateResetPasswordToken(userId, token, expiration) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expiration
    }
  });
}

export async function findUserByResetToken(token) {
  return await prisma.user.findFirst({
    where: {
      resetPasswordToken: token
    }
  });
}

export async function updateUserPassword(userId, password) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password
    }
  });
}
