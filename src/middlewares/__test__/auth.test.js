import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockVerifyTokenAndUser = jest.fn();
const mockNext = jest.fn();

jest.unstable_mockModule('../../services/auth.js', () => ({
  verifyTokenAndUser: mockVerifyTokenAndUser
}));

const authMiddleware = await import('../auth.js');
const { HttpError } = await import('../../utils/error.js');

describe('Authorization Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAuthorized', () => {
    const mockRequest = {
      get: jest.fn()
    };

    const mockResponse = {
      locals: {}
    };

    it('should throw an error if the authorization header is missing', async () => {
      mockRequest.get.mockReturnValue(undefined);

      await expect(
        authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(
        new HttpError('Missing authorization header', 401)
      );
    });

    it('should throw an error if the authorization type is not Bearer', async () => {
      mockRequest.get.mockReturnValue('Basic sometoken');

      await expect(
        authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(new HttpError('Invalid authorization token', 401));
    });

    it('should call verifyTokenAndUser and set res.locals.user if token is valid', async () => {
      const mockUser = { id: 1, role: 'USER' };
      mockRequest.get.mockReturnValue('Bearer validtoken');
      mockVerifyTokenAndUser.mockResolvedValue(mockUser);

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockVerifyTokenAndUser).toHaveBeenCalledWith('validtoken');
      expect(mockResponse.locals.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw an error if verifyTokenAndUser rejects', async () => {
      mockRequest.get.mockReturnValue('Bearer invalidtoken');
      mockVerifyTokenAndUser.mockRejectedValue(new Error('Invalid token'));

      await expect(
        authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError('Invalid token');
    });
  });

  describe('isAdmin', () => {
    const mockResponse = {
      locals: {
        user: { role: 'USER' }
      }
    };

    it('should throw an error if user is not an admin', async () => {
      await expect(
        authMiddleware.isAdmin(null, mockResponse, mockNext)
      ).rejects.toThrowError(new HttpError('Unauthorized', 403));
    });

    it('should call next if user is an admin', async () => {
      mockResponse.locals.user.role = 'ADMIN';

      await authMiddleware.isAdmin(null, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('getCloudSchedulerToken', () => {
    const mockRequest = {
      get: jest.fn()
    };

    it('should throw an error if the authorization header is missing', async () => {
      mockRequest.get.mockReturnValue(undefined);

      await expect(
        authMiddleware.getCloudSchedulerToken(mockRequest, {}, mockNext)
      ).rejects.toThrowError(
        new HttpError('Missing authorization header', 401)
      );
    });

    it('should throw an error if the authorization type is not Bearer', async () => {
      mockRequest.get.mockReturnValue('Basic sometoken');

      await expect(
        authMiddleware.getCloudSchedulerToken(mockRequest, {}, mockNext)
      ).rejects.toThrowError(new HttpError('Invalid authorization token', 401));
    });

    it('should throw an error if the token does not match CLOUD_SCHEDULER_TOKEN', async () => {
      process.env.CLOUD_SCHEDULER_TOKEN = 'correcttoken';
      mockRequest.get.mockReturnValue('Bearer wrongtoken');

      await expect(
        authMiddleware.getCloudSchedulerToken(mockRequest, {}, mockNext)
      ).rejects.toThrowError(new HttpError('Unauthorized', 403));
    });

    it('should call next if the token matches CLOUD_SCHEDULER_TOKEN', async () => {
      process.env.CLOUD_SCHEDULER_TOKEN = 'correcttoken';
      mockRequest.get.mockReturnValue('Bearer correcttoken');

      await authMiddleware.getCloudSchedulerToken(mockRequest, {}, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
