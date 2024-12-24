import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

const mockSendEmail = jest.fn();

jest.unstable_mockModule('../../utils/email/mail.js', () => ({
  sendEmail: mockSendEmail
}));

const mockAppEnv = {
  FRONTEND_URL: 'http://localhost:3000'
};

jest.unstable_mockModule('../../utils/env.js', () => ({
  appEnv: mockAppEnv
}));

const mockGetUserByEmail = jest.fn();
const mockUpdateUserPassword = jest.fn();

jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserByEmail: mockGetUserByEmail,
  updateUserPassword: mockUpdateUserPassword
}));

const mockGetActiveTokenByUserId = jest.fn();
const mockCreatePasswordResetTokenByUserId = jest.fn();
const mockGetActiveTokenWithUser = jest.fn();
const mockValidateResetPasswordToken = jest.fn();

jest.unstable_mockModule('../../repositories/passwordReset.js', () => ({
  getActiveTokenByUserId: mockGetActiveTokenByUserId,
  createPasswordResetTokenByUserId: mockCreatePasswordResetTokenByUserId,
  getActiveTokenWithUser: mockGetActiveTokenWithUser,
  validateResetPasswordToken: mockValidateResetPasswordToken
}));

const passwordResetServices = await import('../passwordReset.js');

const mockCrypto = {
  randomUUID: jest.fn()
};

jest.unstable_mockModule('crypto', () => mockCrypto);

const mockBcrypt = {
  hash: jest.fn().mockResolvedValue('hashed-password')
};

jest.unstable_mockModule('bcrypt', () => mockBcrypt);

describe('passwordResetServices', () => {
  describe('sendResetPasswordEmail', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('throws an error when user not found', async () => {
      mockGetUserByEmail.mockResolvedValue(null);

      const testEmail = 'kiw@test.com';

      await expect(
        passwordResetServices.sendResetPasswordEmail(testEmail)
      ).rejects.toThrowError(new HttpError('User not found', 404));

      expect(mockGetUserByEmail).toHaveBeenCalledWith(testEmail);
    });

    it('does not create a new token if there is an active token', async () => {
      const mockUser = { id: '1', email: 'kiw@test.com' };
      const mockToken = { token: 'testToken' };

      mockGetUserByEmail.mockResolvedValue(mockUser);

      mockGetActiveTokenByUserId.mockResolvedValue(mockToken);

      await passwordResetServices.sendResetPasswordEmail(mockUser.email);

      expect(mockGetActiveTokenByUserId).toHaveBeenCalled();

      expect(mockCreatePasswordResetTokenByUserId).not.toHaveBeenCalled();
    });

    it('sends an email with the reset password link', async () => {
      const mockUser = { id: '1', email: 'kiw@test.com' };

      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockGetActiveTokenByUserId.mockResolvedValue(null);

      await passwordResetServices.sendResetPasswordEmail(mockUser.email);

      expect(mockSendEmail).toHaveBeenCalledWith(
        mockUser.email,
        'Reset Password Request',
        'resetPassword',
        {
          url: expect.stringMatching(
            new RegExp(
              `^${mockAppEnv.FRONTEND_URL}/reset-password\\?token=[\\w-]{36}$`
            )
          )
        }
      );
    });

    it('throws an error if email sending fails', async () => {
      const mockUser = { id: '1', email: 'kiw@test.com' };

      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockGetActiveTokenByUserId.mockResolvedValue(null);
      mockSendEmail.mockRejectedValue(new Error('Email sending failed'));

      await expect(
        passwordResetServices.sendResetPasswordEmail(mockUser.email)
      ).rejects.toThrowError(new HttpError('Email sending failed', 500));

      expect(mockSendEmail).toHaveBeenCalledWith(
        mockUser.email,
        'Reset Password Request',
        'resetPassword',
        {
          url: expect.stringMatching(
            new RegExp(
              `^${mockAppEnv.FRONTEND_URL}/reset-password\\?token=[\\w-]{36}$`
            )
          )
        }
      );
    });
  });

  describe('validateResetPasswordToken', () => {
    it('should return data if token is valid', async () => {
      const mockData = { user: { id: '1' } };

      mockGetActiveTokenWithUser.mockResolvedValue(mockData);

      const result =
        await passwordResetServices.validateResetPasswordToken('test-token');
      expect(result).toBe(mockData);
    });

    it('should throw an error if token is invalid', async () => {
      mockGetActiveTokenWithUser.mockResolvedValue(null);

      await expect(
        passwordResetServices.validateResetPasswordToken('test-token')
      ).rejects.toThrowError(
        new HttpError('Invalid or expired reset password token', 400)
      );
    });
  });

  describe('resetPassword', () => {
    it('should hash the password and update user password if token is valid', async () => {
      const mockData = {
        user: {
          id: '1'
        },
        id: '1'
      };
      const newPassword = 'new-password';

      mockGetActiveTokenWithUser.mockResolvedValue(mockData);

      mockBcrypt.hash.mockResolvedValue(async (password) => {
        const fakeSalt = '$2b$10$';
        const fakeHash = password.split('').reverse().join('');
        return `${fakeSalt}.${fakeHash}`.slice(0, 60);
      });

      await passwordResetServices.resetPassword('test-token', newPassword);

      expect(mockUpdateUserPassword).toHaveBeenCalledWith(
        mockData.user.id,
        mockData.id,
        expect.stringMatching(/^\$2b\$10\$.{53}$/)
      );
    });

    it('should throw error if token is invalid', async () => {
      mockGetActiveTokenWithUser.mockResolvedValue(null);

      await expect(
        passwordResetServices.resetPassword('test-token', 'new-password')
      ).rejects.toThrowError(
        new HttpError('Invalid or expired reset password token', 400)
      );
    });
  });
});
