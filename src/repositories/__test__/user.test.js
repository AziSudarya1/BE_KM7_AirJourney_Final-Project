import { describe, expect, it, jest } from '@jest/globals';

const mockCreateUser = jest.fn();
const mockUpdateUserById = jest.fn();
const mockGetUserByEmail = jest.fn();
const mockGetUserByPhoneNumber = jest.fn();
const mockGetUserById = jest.fn();
const mockCreateNotificationAndVerifiedUser = jest.fn();
const mockUpdateVerifiedUserAndCreateNotification = jest.fn();
const mockUpdateUserVerificationMarkOtpUsedAndCreateNotification = jest.fn();
const mockUpdateResetPasswordToken = jest.fn();
const mockFindUserByResetToken = jest.fn();
const mockUpdateUserPassword = jest.fn();

jest.unstable_mockModule('../../repositories/user.js', () => ({
  createUser: mockCreateUser,
  updateUserById: mockUpdateUserById,
  getUserByEmail: mockGetUserByEmail,
  getUserByPhoneNumber: mockGetUserByPhoneNumber,
  getUserById: mockGetUserById,
  createNotificationAndVerifiedUser: mockCreateNotificationAndVerifiedUser,
  updateVerifiedUserAndCreateNotification:
    mockUpdateVerifiedUserAndCreateNotification,
  updateUserVerificationMarkOtpUsedAndCreateNotification:
    mockUpdateUserVerificationMarkOtpUsedAndCreateNotification,
  updateResetPasswordToken: mockUpdateResetPasswordToken,
  findUserByResetToken: mockFindUserByResetToken,
  updateUserPassword: mockUpdateUserPassword
}));

const userRepository = await import('../../repositories/user.js');

describe('User Repository', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockPayload = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+6281234567890',
        password: 'hashed_password',
        otp: '123456',
        expiredAt: new Date(Date.now() + 60000)
      };
      const mockResult = { id: 'user123', ...mockPayload };

      mockCreateUser.mockResolvedValue(mockResult);

      const result = await userRepository.createUser(mockPayload);

      expect(mockCreateUser).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateUserById', () => {
    it('should update user details by ID', async () => {
      const userId = 'user123';
      const mockPayload = {
        name: 'John Updated',
        phoneNumber: '+6281234560000'
      };
      const mockResult = { id: userId, ...mockPayload };

      mockUpdateUserById.mockResolvedValue(mockResult);

      const result = await userRepository.updateUserById(userId, mockPayload);

      expect(mockUpdateUserById).toHaveBeenCalledWith(userId, mockPayload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john.doe@example.com';
      const mockResult = { id: 'user123', name: 'John Doe', email };

      mockGetUserByEmail.mockResolvedValue(mockResult);

      const result = await userRepository.getUserByEmail(email);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserByPhoneNumber', () => {
    it('should return a user by phone number', async () => {
      const phoneNumber = '+6281234567890';
      const mockResult = { id: 'user123', name: 'John Doe', phoneNumber };

      mockGetUserByPhoneNumber.mockResolvedValue(mockResult);

      const result = await userRepository.getUserByPhoneNumber(phoneNumber);

      expect(mockGetUserByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = 'user123';
      const mockResult = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com'
      };

      mockGetUserById.mockResolvedValue(mockResult);

      const result = await userRepository.getUserById(userId);

      expect(mockGetUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('createNotificationAndVerifiedUser', () => {
    it('should create a verified user with a notification', async () => {
      const mockPayload = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+6281234567890',
        password: 'hashed_password'
      };
      const mockResult = { id: 'user123', ...mockPayload, verified: true };

      mockCreateNotificationAndVerifiedUser.mockResolvedValue(mockResult);

      const result =
        await userRepository.createNotificationAndVerifiedUser(mockPayload);

      expect(mockCreateNotificationAndVerifiedUser).toHaveBeenCalledWith(
        mockPayload
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateVerifiedUserAndCreateNotification', () => {
    it('should update a user to verified and create a notification', async () => {
      const userId = 'user123';
      const mockResult = { id: userId, verified: true };

      mockUpdateVerifiedUserAndCreateNotification.mockResolvedValue(mockResult);

      const result =
        await userRepository.updateVerifiedUserAndCreateNotification(userId);

      expect(mockUpdateVerifiedUserAndCreateNotification).toHaveBeenCalledWith(
        userId
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateUserVerificationMarkOtpUsedAndCreateNotification', () => {
    it('should update user verification, mark OTP as used, and create a notification', async () => {
      const userId = 'user123';
      const otpId = 'otp123';
      const mockResult = { id: userId, verified: true };

      mockUpdateUserVerificationMarkOtpUsedAndCreateNotification.mockResolvedValue(
        mockResult
      );

      const result =
        await userRepository.updateUserVerificationMarkOtpUsedAndCreateNotification(
          userId,
          otpId
        );

      expect(
        mockUpdateUserVerificationMarkOtpUsedAndCreateNotification
      ).toHaveBeenCalledWith(userId, otpId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateResetPasswordToken', () => {
    it('should update the reset password token for a user', async () => {
      const userId = 'user123';
      const token = 'resetToken';
      const expiration = new Date(Date.now() + 3600000);
      const mockResult = { id: userId, resetPasswordToken: token };

      mockUpdateResetPasswordToken.mockResolvedValue(mockResult);

      const result = await userRepository.updateResetPasswordToken(
        userId,
        token,
        expiration
      );

      expect(mockUpdateResetPasswordToken).toHaveBeenCalledWith(
        userId,
        token,
        expiration
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('findUserByResetToken', () => {
    it('should find a user by reset password token', async () => {
      const token = 'resetToken';
      const mockResult = { id: 'user123', resetPasswordToken: token };

      mockFindUserByResetToken.mockResolvedValue(mockResult);

      const result = await userRepository.findUserByResetToken(token);

      expect(mockFindUserByResetToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateUserPassword', () => {
    it('should update the user password', async () => {
      const userId = 'user123';
      const newPassword = 'newHashedPassword';
      const mockResult = { id: userId, password: newPassword };

      mockUpdateUserPassword.mockResolvedValue(mockResult);

      const result = await userRepository.updateUserPassword(
        userId,
        newPassword
      );

      expect(mockUpdateUserPassword).toHaveBeenCalledWith(userId, newPassword);
      expect(result).toEqual(mockResult);
    });
  });
});
