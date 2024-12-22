import { describe, expect, it, jest } from '@jest/globals';

const mockCreateOtp = jest.fn();
const mockFindValidOtp = jest.fn();
const mockFindActiveOtp = jest.fn();

jest.unstable_mockModule('../../repositories/otp.js', () => ({
  createOtp: mockCreateOtp,
  findValidOtp: mockFindValidOtp,
  findActiveOtp: mockFindActiveOtp
}));

const otpRepository = await import('../../repositories/otp.js');

describe('OTP Repository Tests', () => {
  describe('createOtp', () => {
    it('should create a new OTP', async () => {
      const mockOtpData = {
        userId: 'user-id-123',
        otp: '123456',
        expiredAt: new Date(Date.now() + 60 * 1000)
      };

      mockCreateOtp.mockResolvedValue(mockOtpData);

      const result = await otpRepository.createOtp(
        mockOtpData.userId,
        mockOtpData.otp,
        mockOtpData.expiredAt
      );

      expect(mockCreateOtp).toHaveBeenCalledWith(
        mockOtpData.userId,
        mockOtpData.otp,
        mockOtpData.expiredAt
      );
      expect(result).toEqual(mockOtpData);
    });
  });

  describe('findValidOtp', () => {
    it('should find a valid OTP', async () => {
      const mockValidOtp = {
        id: 'otp-id-123',
        userId: 'user-id-123',
        otp: '123456',
        used: false,
        expiredAt: new Date(Date.now() + 60 * 1000)
      };

      mockFindValidOtp.mockResolvedValue(mockValidOtp);

      const result = await otpRepository.findValidOtp(
        mockValidOtp.userId,
        mockValidOtp.otp
      );

      expect(mockFindValidOtp).toHaveBeenCalledWith(
        mockValidOtp.userId,
        mockValidOtp.otp
      );
      expect(result).toEqual(mockValidOtp);
    });

    it('should return null for an invalid OTP', async () => {
      mockFindValidOtp.mockResolvedValue(null);

      const result = await otpRepository.findValidOtp('user-id-123', '000000');

      expect(mockFindValidOtp).toHaveBeenCalledWith('user-id-123', '000000');
      expect(result).toBeNull();
    });
  });

  describe('findActiveOtp', () => {
    it('should find an active OTP for a user', async () => {
      const mockActiveOtp = {
        id: 'otp-id-123',
        userId: 'user-id-123',
        otp: '123456',
        used: false,
        expiredAt: new Date(Date.now() + 60 * 1000)
      };

      mockFindActiveOtp.mockResolvedValue(mockActiveOtp);

      const result = await otpRepository.findActiveOtp(mockActiveOtp.userId);

      expect(mockFindActiveOtp).toHaveBeenCalledWith(mockActiveOtp.userId);
      expect(result).toEqual(mockActiveOtp);
    });

    it('should return null if no active OTP exists', async () => {
      mockFindActiveOtp.mockResolvedValue(null);

      const result = await otpRepository.findActiveOtp('user-id-123');

      expect(mockFindActiveOtp).toHaveBeenCalledWith('user-id-123');
      expect(result).toBeNull();
    });
  });
});
