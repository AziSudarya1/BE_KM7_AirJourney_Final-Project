import { prisma } from '../utils/db.js';

export function createUser(payload) {
  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
      role: 'USER',
      otp: {
        create: {
          otp: payload.otp,
          expiredAt: payload.expiredAt
        }
      }
    }
  });
}

export function createNotificationAndVerifiedUser(payload) {
  return prisma.user.create({
    data: {
      ...payload,
      role: 'USER',
      verified: true,
      notification: {
        create: {
          title: 'Registrasi Berhasil',
          message: 'Selamat datang di Terbangin!'
        }
      }
    }
  });
}

export function updateVerifiedUserAndCreateNotification(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      verified: true,
      notification: {
        create: {
          title: 'Registrasi Berhasil',
          message: 'Selamat datang di Terbangin!'
        }
      }
    }
  });
}

export function getUserById(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId
    }
  });
}

export function updateUserVerificationMarkOtpUsedAndCreateNotification(
  userId,
  otpId
) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      verified: true,
      otp: {
        update: {
          where: {
            id: otpId
          },
          data: {
            used: true
          }
        }
      },
      notification: {
        create: {
          title: 'Registrasi Berhasil',
          message: 'Selamat datang di Terbangin!'
        }
      }
    }
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

export function updateUserById(userId, payload) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: payload.name,
      phoneNumber: payload.phoneNumber
    }
  });
}

export function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export function getUserByPhoneNumber(phoneNumber) {
  return prisma.user.findUnique({
    where: {
      phoneNumber
    }
  });
}
