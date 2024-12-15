import { describe, expect, it, jest } from '@jest/globals';

const mockCreateNotification = jest.fn();
const mockGetAllNotifications = jest.fn();
const mockUpdateNotification = jest.fn();
const mockUpdateAllNotification = jest.fn();
const mockdeleteNotificationById = jest.fn();

jest.unstable_mockModule('../../services/notification.js', () => ({
  createNotification: mockCreateNotification,
  getAllNotification: mockGetAllNotifications,
  updateNotification: mockUpdateNotification,
  updateAllNotification: mockUpdateAllNotification,
  deleteNotification: mockdeleteNotificationById
}));

const notificationController = await import('../notification.js');

describe('Notification Controller', () => {
  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const mockRequest = {
        body: {
          title: 'Notification 1',
          message: 'This is notification 1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await notificationController.createNotification(
        mockRequest,
        mockResponse
      );

      expect(mockCreateNotification).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'notification created succesfully',
        data
      });
    });
  });

  describe('getAllNotification', () => {
    it('should get all notifications', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: '1'
          }
        }
      };
      const data = await notificationController.getAllNotification(
        mockRequest,
        mockResponse
      );

      expect(mockGetAllNotifications).toHaveBeenCalledWith(
        mockResponse.locals.user.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Get all notification succesfully',
        data
      });
    });
  });

  describe('updateNotification', () => {
    it('should update a notification', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          notification: {
            id: '1'
          }
        },
        locals: {
          user: {
            userId: '1'
          }
        }
      };

      await notificationController.updateNotification(
        mockRequest,
        mockResponse
      );

      expect(mockUpdateNotification).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockResponse.locals.user.userId,
        mockResponse.locals.notification
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully read notification!'
      });
    });
  });

  describe('updateAllNotification', () => {
    it('should update all notification', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: '1'
          }
        }
      };

      await notificationController.updateAllNotification(
        mockRequest,
        mockResponse
      );

      expect(mockUpdateAllNotification).toHaveBeenCalledWith(
        mockResponse.locals.user.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully read all notifications!'
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            userId: '1'
          }
        }
      };

      await notificationController.deleteNotification(
        mockRequest,
        mockResponse
      );

      expect(mockdeleteNotificationById).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockResponse.locals.user.userId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Notification deleted succesfully!'
      });
    });
  });
});
