import { describe, expect, it, jest } from '@jest/globals';

const mockGetActiveTokenWithUser = jest.fn();
const mockCreatePasswordResetTokenByUserId = jest.fn();
const mockGetActiveTokenByUserId = jest.fn();

jest.unstable_mockModule('../../repositories/passwordReset.js', () => ({
  getActiveTokenWithUser: mockGetActiveTokenWithUser,
  createPasswordResetTokenByUserId: mockCreatePasswordResetTokenByUserId,
  getActiveTokenByUserId: mockGetActiveTokenByUserId
}));

const passwordResetRepository = await import(
  '../../repositories/passwordReset.js'
);

describe('Password Reset Repository Tests', () => {
  describe('getActiveTokenWithUser', () => {
    it('should retrieve an active token with user information', async () => {
      const mockTokenData = {
        id: 'token-id-123',
        token: 'reset-token',
        used: false,
        expiredAt: new Date(Date.now() + 3600 * 1000),
        user: {
          id: 'user-id-123',
          email: 'test@example.com'
        }
      };

      mockGetActiveTokenWithUser.mockResolvedValue(mockTokenData);

      const result =
        await passwordResetRepository.getActiveTokenWithUser('reset-token');

      expect(mockGetActiveTokenWithUser).toHaveBeenCalledWith('reset-token');
      expect(result).toEqual(mockTokenData);
    });

    it('should return null if no active token exists', async () => {
      mockGetActiveTokenWithUser.mockResolvedValue(null);

      const result =
        await passwordResetRepository.getActiveTokenWithUser('invalid-token');

      expect(mockGetActiveTokenWithUser).toHaveBeenCalledWith('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('createPasswordResetTokenByUserId', () => {
    it('should create a password reset token for a user', async () => {
      const mockTokenData = {
        id: 'token-id-123',
        token: 'reset-token',
        userId: 'user-id-123',
        expiredAt: new Date(Date.now() + 3600 * 1000)
      };

      mockCreatePasswordResetTokenByUserId.mockResolvedValue(mockTokenData);

      const result =
        await passwordResetRepository.createPasswordResetTokenByUserId(
          'user-id-123',
          'reset-token',
          mockTokenData.expiredAt
        );

      expect(mockCreatePasswordResetTokenByUserId).toHaveBeenCalledWith(
        'user-id-123',
        'reset-token',
        mockTokenData.expiredAt
      );
      expect(result).toEqual(mockTokenData);
    });
  });

  describe('getActiveTokenByUserId', () => {
    it('should retrieve an active token for a user', async () => {
      const mockTokenData = {
        id: 'token-id-123',
        token: 'reset-token',
        userId: 'user-id-123',
        used: false,
        expiredAt: new Date(Date.now() + 3600 * 1000)
      };

      mockGetActiveTokenByUserId.mockResolvedValue(mockTokenData);

      const result =
        await passwordResetRepository.getActiveTokenByUserId('user-id-123');

      expect(mockGetActiveTokenByUserId).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockTokenData);
    });

    it('should return null if no active token exists for the user', async () => {
      mockGetActiveTokenByUserId.mockResolvedValue(null);

      const result =
        await passwordResetRepository.getActiveTokenByUserId('user-id-456');

      expect(mockGetActiveTokenByUserId).toHaveBeenCalledWith('user-id-456');
      expect(result).toBeNull();
    });
  });
});
