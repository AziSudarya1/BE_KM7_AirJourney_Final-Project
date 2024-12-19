import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockCheckNotificationId = jest.fn();
const mockGetNotification = jest.fn();

jest.unstable_mockModule('../../services/notification.js', () => ({
  checkNotificationId: mockCheckNotificationId,
  getNotification: mockGetNotification
}));

const notificationMiddleware = await import('../notification.js');
const { HttpError } = await import('../../utils/error.js');

describe('Notification Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkNotificationExistById', () => {
    const mockRequest = {
      params: {
        id: '1'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if notification exists', async () => {
      mockCheckNotificationId.mockResolvedValue({ id: '1' });

      await notificationMiddleware.checkNotificationExistById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockCheckNotificationId).toHaveBeenCalledWith('1');
      expect(mockResponse.locals.notification).toEqual({ id: '1' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if notification does not exist', async () => {
      mockCheckNotificationId.mockResolvedValue(null);

      await expect(
        notificationMiddleware.checkNotificationExistById(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(new HttpError('Notification not found!', 404));
    });
  });

  describe('checkUserHasAtLeastOneNotification', () => {
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        user: { id: '1' }
      }
    };

    const mockNext = jest.fn();

    it('should call next if user has at least one notification', async () => {
      mockGetNotification.mockResolvedValue({ id: '1' });

      await notificationMiddleware.checkUserHasAtLeastOneNotification(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetNotification).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if user has no notifications', async () => {
      mockGetNotification.mockResolvedValue(null);

      await expect(
        notificationMiddleware.checkUserHasAtLeastOneNotification(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('No unread notification found!', 404)
      );
    });
  });

  describe('checkUserAccesToNotification', () => {
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        user: { id: '1' },
        notification: { userId: '1' }
      }
    };

    const mockNext = jest.fn();

    it('should call next if user has access to the notification', async () => {
      await notificationMiddleware.checkUserAccesToNotification(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if user does not have access to the notification', async () => {
      mockResponse.locals.notification.userId = '2';

      await expect(
        notificationMiddleware.checkUserAccesToNotification(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('Unauthorized access to these notifications', 403)
      );
    });
  });
});
