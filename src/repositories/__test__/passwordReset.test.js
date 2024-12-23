import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    passwordReset: {
      create: jest.fn(),
      findFirst: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const passwordResetRepository = await import('../passwordReset.js');

describe('passwordResetRepository', () => {
  describe('getActiveTokenWithUser', () => {
    it('should return the active token with user details', async () => {
      const token = 'test-token';
      const mockTokenWithUser = { token, user: { id: 1, name: 'John Doe' } };
      prisma.passwordReset.findFirst.mockResolvedValue(mockTokenWithUser);

      const result =
        await passwordResetRepository.getActiveTokenWithUser(token);

      expect(prisma.passwordReset.findFirst).toHaveBeenCalledWith({
        where: {
          token,
          used: false,
          expiredAt: {
            gt: expect.any(Date)
          }
        },
        include: {
          user: true
        }
      });
      expect(result).toEqual(mockTokenWithUser);
    });

    it('should return null if no active token is found', async () => {
      const token = 'invalid-token';
      prisma.passwordReset.findFirst.mockResolvedValue(null);

      const result =
        await passwordResetRepository.getActiveTokenWithUser(token);

      expect(prisma.passwordReset.findFirst).toHaveBeenCalledWith({
        where: {
          token,
          used: false,
          expiredAt: {
            gt: expect.any(Date)
          }
        },
        include: {
          user: true
        }
      });
      expect(result).toBeNull();
    });
  });

  describe('createPasswordResetTokenByUserId', () => {
    it('should create a new password reset token', async () => {
      const userId = 1;
      const token = 'new-token';
      const expiration = new Date(Date.now() + 3600000); // 1 hour from now
      const mockCreatedToken = { id: 1, token, userId, expiredAt: expiration };
      prisma.passwordReset.create.mockResolvedValue(mockCreatedToken);

      const result =
        await passwordResetRepository.createPasswordResetTokenByUserId(
          userId,
          token,
          expiration
        );

      expect(prisma.passwordReset.create).toHaveBeenCalledWith({
        data: {
          token,
          userId,
          expiredAt: expiration
        }
      });
      expect(result).toEqual(mockCreatedToken);
    });
  });

  describe('getActiveTokenByUserId', () => {
    it('should return the active token for the user', async () => {
      const userId = 1;
      const mockToken = { token: 'active-token', userId };
      prisma.passwordReset.findFirst.mockResolvedValue(mockToken);

      const result =
        await passwordResetRepository.getActiveTokenByUserId(userId);

      expect(prisma.passwordReset.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          used: false,
          expiredAt: {
            gt: expect.any(Date)
          }
        }
      });
      expect(result).toEqual(mockToken);
    });

    it('should return null if no active token is found for the user', async () => {
      const userId = 1;
      prisma.passwordReset.findFirst.mockResolvedValue(null);

      const result =
        await passwordResetRepository.getActiveTokenByUserId(userId);

      expect(prisma.passwordReset.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          used: false,
          expiredAt: {
            gt: expect.any(Date)
          }
        }
      });
      expect(result).toBeNull();
    });
  });
});
