import { describe, expect, it, jest } from '@jest/globals';

const mockSendResetPasswordEmail = jest.fn();
const validateResetPasswordToken = jest.fn();
const mockResetPassword = jest.fn();

jest.unstable_mockModule('../../services/passwordReset.js', () => ({
  sendResetPasswordEmail: mockSendResetPasswordEmail,
  validateResetPasswordToken: validateResetPasswordToken,
  resetPassword: mockResetPassword
}));

const passwordResetController = await import('../passwordReset.js');

describe('Password Reset Controller', () => {
  describe('sendResetPasswordEmail', () => {
    it('should call sendResetPasswordEmail service', async () => {
      const mockRequest = {
        body: {
          email: 'kiw@example.com'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await passwordResetController.sendResetPasswordEmail(
        mockRequest,
        mockResponse
      );
      expect(mockSendResetPasswordEmail).toHaveBeenCalledWith(
        mockRequest.body.email
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Reset password email send successfully'
      });
    });
  });

  describe('validateResetPasswordToken', () => {
    it('should call validateResetPasswordToken service', async () => {
      const mockRequest = {
        params: {
          token: '123456'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await passwordResetController.validateResetPasswordToken(
        mockRequest,
        mockResponse
      );
      expect(validateResetPasswordToken).toHaveBeenCalledWith(
        mockRequest.params.token
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Reset password token is valid'
      });
    });
  });

  describe('resetPassword', () => {
    it('should call resetPassword service', async () => {
      const mockRequest = {
        body: {
          token: '123456',
          newPassword: 'newPassword'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await passwordResetController.resetPassword(mockRequest, mockResponse);
      expect(mockResetPassword).toHaveBeenCalledWith(
        mockRequest.body.token,
        mockRequest.body.newPassword
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password reset successfully'
      });
    });
  });
});
