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

    it('should skip email check if email is the same as current user', async () => {
      const mockRequest = {
        body: {
          email: 'test@gmail.com'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            email: 'test@gmail.com'
          }
        }
      };

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should check email uniqueness if email is different from current user', async () => {
      const mockRequest = {
        body: {
          email: 'newemail@gmail.com'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            email: 'test@gmail.com'
          }
        }
      };

      mockGetUserByEmail.mockResolvedValue(null);

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetUserByEmail).toHaveBeenCalledWith('newemail@gmail.com');
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

    it('should skip phone number check if phone number is the same as current user', async () => {
      const mockRequest = {
        body: {
          phoneNumber: '1234567890'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            phoneNumber: '1234567890'
          }
        }
      };

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetUserByPhoneNumber).not.toHaveBeenCalled();
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

    it('should check phone number uniqueness if phone number is different from current user', async () => {
      const mockRequest = {
        body: {
          phoneNumber: '0987654321'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            phoneNumber: '1234567890'
          }
        }
      };

      mockGetUserByPhoneNumber.mockResolvedValue(null);

      await userMiddleware.checkUserEmailorPhoneNumberExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetUserByPhoneNumber).toHaveBeenCalledWith('0987654321');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
