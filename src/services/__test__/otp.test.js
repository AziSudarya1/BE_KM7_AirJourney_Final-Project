import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

const mockSendEmail = jest.fn();

jest.unstable_mockModule('../../utils/email/mail.js', () => ({
  sendEmail: mockSendEmail
}));

const mockGenerateOtp = jest.fn();

jest.unstable_mockModule('../../utils/helper.js', () => ({
  generateOtp: mockGenerateOtp
}));

const mockGetUserByEmail = jest.fn();
const mockUpdateUserVerificationMarkOtpUsedAndCreateNotification = jest.fn();

jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserByEmail: mockGetUserByEmail,
  updateUserVerificationMarkOtpUsedAndCreateNotification:
    mockUpdateUserVerificationMarkOtpUsedAndCreateNotification
}));

const mockFindActiveOtp = jest.fn();
const mockCreateOtp = jest.fn();
const mockFindValidOtp = jest.fn();

jest.unstable_mockModule('../../repositories/otp.js', () => ({
  findActiveOtp: mockFindActiveOtp,
  createOtp: mockCreateOtp,
  findValidOtp: mockFindValidOtp
}));

const otpServices = await import('../otp.js');

describe('OTP Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOtp', () => {
    it('should throw an error if user is not found', async () => {
      mockGetUserByEmail.mockResolvedValue(null);

      await expect(
        otpServices.sendOtp('test@example.com')
      ).rejects.toThrowError(new HttpError('User not found', 404));
    });

    it('should throw an error if user is already verified', async () => {
      mockGetUserByEmail.mockResolvedValue({ verified: true });

      await expect(
        otpServices.sendOtp('test@example.com')
      ).rejects.toThrowError(new HttpError('User is already verified', 400));
    });

    it('should throw an error if an active OTP already exists', async () => {
      mockGetUserByEmail.mockResolvedValue({ id: '1', verified: false });
      mockFindActiveOtp.mockResolvedValue(true);

      await expect(
        otpServices.sendOtp('test@example.com')
      ).rejects.toThrowError(
        new HttpError('An active OTP already exists', 400)
      );
    });

    it('should create a new OTP and send an email', async () => {
      mockGetUserByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        verified: false
      });
      mockFindActiveOtp.mockResolvedValue(null);
      mockGenerateOtp.mockReturnValue('123456');
      mockCreateOtp.mockResolvedValue({ id: '1', otp: '123456' });

      const result = await otpServices.sendOtp('test@example.com');

      expect(mockGenerateOtp).toHaveBeenCalled();
      expect(mockCreateOtp).toHaveBeenCalledWith(
        '1',
        '123456',
        expect.any(Date)
      );
      expect(mockSendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Your OTP Code',
        'otp',
        { otp: '123456' }
      );
      expect(result).toEqual({ id: '1', otp: '123456' });
    });
  });

  describe('verifyOtp', () => {
    it('should throw an error if user is not found', async () => {
      mockGetUserByEmail.mockResolvedValue(null);

      await expect(
        otpServices.verifyOtp('test@example.com', '123456')
      ).rejects.toThrowError(new HttpError('User not found', 404));
    });

    it('should throw an error if OTP is invalid or expired', async () => {
      mockGetUserByEmail.mockResolvedValue({ id: '1' });
      mockFindValidOtp.mockResolvedValue(null);

      await expect(
        otpServices.verifyOtp('test@example.com', '123456')
      ).rejects.toThrowError(new HttpError('Invalid or expired OTP', 400));
    });

    it('should verify the OTP and update user verification', async () => {
      mockGetUserByEmail.mockResolvedValue({ id: '1' });
      mockFindValidOtp.mockResolvedValue({ id: '1' });
      mockUpdateUserVerificationMarkOtpUsedAndCreateNotification.mockResolvedValue(
        { success: true }
      );

      const result = await otpServices.verifyOtp('test@example.com', '123456');

      expect(mockFindValidOtp).toHaveBeenCalledWith('1', '123456');
      expect(
        mockUpdateUserVerificationMarkOtpUsedAndCreateNotification
      ).toHaveBeenCalledWith('1', '1');
      expect(result).toEqual({ success: true });
    });
  });
});
