import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const userRepository = await import('../user.js');

describe('User Repository', () => {
  const payload = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    otp: '123456',
    expiredAt: new Date()
  };

  const userId = 'user-id';
  const otpId = 'otp-id';
  const tokenId = 'password-id';
  const token = 'reset-token';
  const expiration = new Date();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    await userRepository.createUser(payload);
    expect(prisma.user.create).toHaveBeenCalledWith({
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
  });

  it('should create a notification and verified user', async () => {
    await userRepository.createNotificationAndVerifiedUser(payload);
    expect(prisma.user.create).toHaveBeenCalledWith({
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
  });

  it('should update verified user and create notification', async () => {
    await userRepository.updateVerifiedUserAndCreateNotification(userId);
    expect(prisma.user.update).toHaveBeenCalledWith({
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
  });

  it('should get user by id', async () => {
    await userRepository.getUserById(userId);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId }
    });
  });

  it('should update user verification, mark OTP used, and create notification', async () => {
    await userRepository.updateUserVerificationMarkOtpUsedAndCreateNotification(
      userId,
      otpId
    );
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: {
        verified: true,
        otp: {
          update: {
            where: { id: otpId },
            data: { used: true }
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
  });

  it('should update reset password token', async () => {
    await userRepository.updateResetPasswordToken(userId, token, expiration);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiration
      }
    });
  });

  it('should find user by reset token', async () => {
    await userRepository.findUserByResetToken(token);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { resetPasswordToken: token }
    });
  });

  it('should update user password', async () => {
    await userRepository.updateUserPassword(userId, tokenId, 'new-password');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: {
        password: 'new-password',
        passwordReset: {
          update: {
            where: { id: tokenId },
            data: { used: true }
          }
        }
      }
    });
  });

  it('should update user by id', async () => {
    await userRepository.updateUserById(userId, payload);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: {
        name: payload.name,
        phoneNumber: payload.phoneNumber
      }
    });
  });

  it('should get user by email', async () => {
    await userRepository.getUserByEmail(payload.email);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: payload.email }
    });
  });

  it('should get user by phone number', async () => {
    await userRepository.getUserByPhoneNumber(payload.phoneNumber);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { phoneNumber: payload.phoneNumber }
    });
  });
});
