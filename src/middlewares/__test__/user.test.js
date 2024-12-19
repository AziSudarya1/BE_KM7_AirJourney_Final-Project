import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockGetUserByEmail = jest.fn();
const mockGetUserByPhoneNumber = jest.fn();

jest.unstable_mockModule('../../services/user.js', () => ({
  getUserByEmail: mockGetUserByEmail,
  getUserByPhoneNumber: mockGetUserByPhoneNumber
}));

const userMiddleware = await import('../user.js');
const { HttpError } = await import('../../utils/error.js');

describe('user middleware', () => {
  describe('checkUserEmailExist', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockRequest = {
      body: {
        email: 'test@gmail.com'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if email does not exist', async () => {
      mockGetUserByEmail.mockResolvedValue(null);

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 409 if email exists', async () => {
      mockGetUserByEmail.mockResolvedValue({
        email: 'test@gmail.com'
      });

      await expect(
        userMiddleware.checkUserEmailorPhoneNumberExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('User with the same email already exist!', 409)
      );
    });
  });

  describe('checkUserPhoneNumberExist', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockRequest = {
      body: {
        phoneNumber: '1234567890'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if phone number does not exist', async () => {
      mockGetUserByPhoneNumber.mockResolvedValue(null);

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 409 if phone number exists', async () => {
      mockGetUserByPhoneNumber.mockResolvedValue({
        phoneNumber: '1234567890'
      });

      await expect(
        userMiddleware.checkUserEmailorPhoneNumberExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('User with the same phone already exist!', 409)
      );
    });
  });
});
