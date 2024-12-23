import { describe, it, expect, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/env.js', () => ({
  appEnv: { BCRYPT_SALT: '10' }
}));

jest.unstable_mockModule('../../utils/helper.js', () => ({
  generateOtp: jest.fn()
}));

const { generateOtp } = await import('../../utils/helper.js');

jest.unstable_mockModule('../../utils/email/mail.js', () => ({
  sendEmail: jest.fn()
}));

const { sendEmail } = await import('../../utils/email/mail.js');

jest.unstable_mockModule('bcrypt', () => {
  const bcrypt = {
    hash: jest.fn(),
    compare: jest.fn()
  };
  return { default: bcrypt };
});

const { default: bcrypt } = await import('bcrypt');

const mockCreateUser = jest.fn();
const mockUpdateUserById = jest.fn();
const mockGetUserByEmail = jest.fn();
const mockGetUserByPhoneNumber = jest.fn();
const mockGetUserById = jest.fn();

jest.unstable_mockModule('../../repositories/user.js', () => ({
  createUser: mockCreateUser,
  updateUserById: mockUpdateUserById,
  getUserByEmail: mockGetUserByEmail,
  getUserByPhoneNumber: mockGetUserByPhoneNumber,
  getUserById: mockGetUserById
}));

const userServices = await import('../user.js');

describe('User Services', () => {
  describe('createUser', () => {
    it('should create a user and send an email with OTP', async () => {
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const phoneNumber = '1234567890';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';
      const otp = '123456';
      const userPayload = {
        name,
        email,
        phoneNumber,
        otp,
        expiredAt: expect.any(Date),
        password: hashedPassword
      };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      generateOtp.mockReturnValue(otp);
      mockCreateUser.mockResolvedValue(userPayload);

      const result = await userServices.createUser(
        name,
        email,
        phoneNumber,
        password
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(generateOtp).toHaveBeenCalled();
      expect(mockCreateUser).toHaveBeenCalledWith(userPayload);
      expect(sendEmail).toHaveBeenCalledWith(email, 'Your OTP Code', 'otp', {
        otp
      });
      expect(result).toEqual(userPayload);
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const userId = '1';
      const payload = { name: 'Jane Doe' };
      const updatedUser = { id: userId, ...payload };

      mockUpdateUserById.mockResolvedValue(updatedUser);

      const result = await userServices.updateUserById(userId, payload);

      expect(mockUpdateUserById).toHaveBeenCalledWith(userId, payload);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should get a user by email', async () => {
      const email = 'john.doe@example.com';
      const user = { id: '1', email };

      mockGetUserByEmail.mockResolvedValue(user);

      const result = await userServices.getUserByEmail(email);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });
  });

  describe('getUserByPhoneNumber', () => {
    it('should get a user by phone number', async () => {
      const phoneNumber = '1234567890';
      const user = { id: '1', phoneNumber };

      mockGetUserByPhoneNumber.mockResolvedValue(user);

      const result = await userServices.getUserByPhoneNumber(phoneNumber);

      expect(mockGetUserByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(result).toEqual(user);
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const userId = '1';
      const user = { id: userId };

      mockGetUserById.mockResolvedValue(user);

      const result = await userServices.getUserById(userId);

      expect(mockGetUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });
});
