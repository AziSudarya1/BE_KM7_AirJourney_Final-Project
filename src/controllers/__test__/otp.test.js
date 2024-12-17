import { describe, expect, it, jest } from '@jest/globals';

const mockSendOtp = jest.fn();
const mockVerifyOtp = jest.fn();

jest.unstable_mockModule('../../services/otp.js', () => ({
  sendOtp: mockSendOtp,
  verifyOtp: mockVerifyOtp
}));

const otpController = await import('../otp.js');

describe('OTP Controller', () => {
  describe('sendOtp', () => {
    it('should call sendOtp service', async () => {
      const mockRequest = {
        body: {
          email: 'kiw@example.com'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await otpController.sendOtp(mockRequest, mockResponse);
      expect(mockSendOtp).toHaveBeenCalledWith('kiw@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP sent successfully'
      });
    });
  });

  describe('verifyOtp', () => {
    it('should call verifyOtp service', async () => {
      const mockRequest = {
        body: {
          email: 'kiw@example.com',
          otp: '123456'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await otpController.verifyOtp(mockRequest, mockResponse);
      expect(mockVerifyOtp).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.otp
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP verified successfully'
      });
    });
  });
});
