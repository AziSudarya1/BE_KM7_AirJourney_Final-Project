import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    otp: {
      create: jest.fn(),
      findFirst: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const otpRepository = await import('../otp.js');

describe('otpRepository', () => {
  const userId = 'user123';
  const otp = '123456';
  const expiredAt = new Date(Date.now() + 1000 * 60 * 10);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOtp', () => {
    it('should create a new OTP', async () => {
      const mockOtp = { id: 'otp123', userId, otp, expiredAt };
      prisma.otp.create.mockResolvedValue(mockOtp);

      const result = await otpRepository.createOtp(userId, otp, expiredAt);

      expect(prisma.otp.create).toHaveBeenCalledWith({
        data: {
          userId,
          otp,
          expiredAt
        }
      });
      expect(result).toEqual(mockOtp);
    });
  });

  describe('findValidOtp', () => {
    it('should find a valid OTP', async () => {
      const mockOtp = { id: 'otp123', userId, otp, expiredAt, used: false };
      prisma.otp.findFirst.mockResolvedValue(mockOtp);

      const result = await otpRepository.findValidOtp(userId, otp);

      expect(prisma.otp.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          otp,
          used: false,
          expiredAt: { gt: expect.any(Date) }
        }
      });
      expect(result).toEqual(mockOtp);
    });

    it('should return null if no valid OTP is found', async () => {
      prisma.otp.findFirst.mockResolvedValue(null);

      const result = await otpRepository.findValidOtp(userId, otp);

      expect(prisma.otp.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          otp,
          used: false,
          expiredAt: { gt: expect.any(Date) }
        }
      });
      expect(result).toBeNull();
    });
  });

  describe('findActiveOtp', () => {
    it('should find an active OTP', async () => {
      const mockOtp = { id: 'otp123', userId, otp, expiredAt, used: false };
      prisma.otp.findFirst.mockResolvedValue(mockOtp);

      const result = await otpRepository.findActiveOtp(userId);

      expect(prisma.otp.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          used: false,
          expiredAt: { gt: expect.any(Date) }
        }
      });
      expect(result).toEqual(mockOtp);
    });

    it('should return null if no active OTP is found', async () => {
      prisma.otp.findFirst.mockResolvedValue(null);

      const result = await otpRepository.findActiveOtp(userId);

      expect(prisma.otp.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          used: false,
          expiredAt: { gt: expect.any(Date) }
        }
      });
      expect(result).toBeNull();
    });
  });
});
