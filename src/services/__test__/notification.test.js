import { describe, expect, it, jest } from '@jest/globals';

const mockCreateNotification = jest.fn();
const mockCheckNotificationId = jest.fn();
const mockGetNotification = jest.fn();
const mockGetAllNotification = jest.fn();
const mockUpdateNotificcation = jest.fn();
const mockUpdateAllNotification = jest.fn();
const mockDeleteNotification = jest.fn();
const mockCheckUserId = jest.fn();
const mockGetUserById = jest.fn();
const mockCreateUserNotification = jest.fn();

import { HttpError } from '../../utils/error.js';

jest.unstable_mockModule('../../repositories/notification.js', () => ({
  createNotification: mockCreateNotification,
  checkNotificationId: mockCheckNotificationId,
  getNotification: mockGetNotification,
  getAllNotification: mockGetAllNotification,
  updateNotification: mockUpdateNotificcation,
  updateAllNotification: mockUpdateAllNotification,
  deleteNotification: mockDeleteNotification,
  checkUserId: mockCheckUserId,
  createUserNotification: mockCreateUserNotification
}));

jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserById: mockGetUserById
}));

const mockTx = {
  commit: jest.fn(),
  rollback: jest.fn()
};

const notificationServices = await import('../notification.js');

describe('Notification Services', () => {
  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const payload = {
        title: 'Test Notification',
        message: 'This is a test notification',
        userId: '1'
      };
      mockCreateNotification.mockResolvedValue(
        'Notification created successfully'
      );
      mockGetUserById.mockResolvedValue({ id: '1', name: 'User 1' });

      const result = await notificationServices.createNotification(payload);

      expect(mockGetUserById).toHaveBeenCalledWith('1');
      expect(mockCreateNotification).toHaveBeenCalledWith(payload);
      expect(result).toEqual('Notification created successfully');
    });

    it('should throw error if user is not found', async () => {
      const payload = {
        title: 'Test Notification',
        message: 'This is a test notification',
        userId: '999'
      };
      mockGetUserById.mockResolvedValue(null);

      await expect(
        notificationServices.createNotification(payload)
      ).rejects.toThrowError(new HttpError('User not found!', 404));
    });
  });

  describe('getNotificationId', () => {
    it('should return notification by id', async () => {
      const id = '123';
      mockCheckNotificationId.mockResolvedValue({
        id,
        title: 'Notification Title'
      });

      const result = await notificationServices.getNotificationId(id);

      expect(mockCheckNotificationId).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id, title: 'Notification Title' });
    });
  });

  describe('checkNotificationId', () => {
    it('should check if notification exists by id', async () => {
      const id = '123';
      mockCheckNotificationId.mockResolvedValue(true);

      const result = await notificationServices.checkNotificationId(id);

      expect(mockCheckNotificationId).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });

  describe('checkUserId', () => {
    it('should check if user exists by id', async () => {
      const userId = '1';
      mockCheckUserId.mockResolvedValue({ id: userId, name: 'User 1' });

      const result = await notificationServices.checkUserId(userId);

      expect(mockCheckUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ id: userId, name: 'User 1' });
    });
  });

  describe('getNotification', () => {
    it('should get notifications for a user', async () => {
      const userId = '1';
      mockGetNotification.mockResolvedValue([
        { id: '123', title: 'Notification Title' }
      ]);

      const result = await notificationServices.getNotification(userId);

      expect(mockGetNotification).toHaveBeenCalledWith(userId);
      expect(result).toEqual([{ id: '123', title: 'Notification Title' }]);
    });
  });

  describe('getAllNotification', () => {
    it('should get all notifications for a user', async () => {
      const userId = '1';
      mockGetAllNotification.mockResolvedValue([
        { id: '123', title: 'Notification Title' }
      ]);

      const result = await notificationServices.getAllNotification(userId);

      expect(mockGetAllNotification).toHaveBeenCalledWith(userId);
      expect(result).toEqual([{ id: '123', title: 'Notification Title' }]);
    });
  });

  describe('updateNotification', () => {
    it('should update a notification', async () => {
      const id = '123';
      const userId = '1';
      const notification = { isRead: false };
      mockUpdateNotificcation.mockResolvedValue({ success: true });

      const result = await notificationServices.updateNotification(
        id,
        userId,
        notification
      );

      expect(mockUpdateNotificcation).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if notification is already read', async () => {
      const id = '123';
      const userId = '1';
      const notification = { isRead: true };

      await expect(
        notificationServices.updateNotification(id, userId, notification)
      ).rejects.toThrowError(new HttpError('Notification already read!', 400));
    });
  });

  describe('updateAllNotification', () => {
    it('should mark all notifications as read for a user', async () => {
      const userId = '1';
      mockUpdateAllNotification.mockResolvedValue({ success: true });

      const result = await notificationServices.updateAllNotification(userId);

      expect(mockUpdateAllNotification).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const id = '123';
      const userId = '1';
      mockDeleteNotification.mockResolvedValue({ success: true });

      const result = await notificationServices.deleteNotification(id, userId);

      expect(mockDeleteNotification).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual({ success: true });
    });
  });

  describe('createUserNotification', () => {
    it('should create a notification for a user', async () => {
      const userId = '1';
      const payload = {
        title: 'Test Notification',
        message: 'This is a test notification'
      };
      mockCreateUserNotification.mockResolvedValue({
        id: '123',
        title: 'Test Notification'
      });

      const result = await notificationServices.createUserNotification(
        userId,
        payload,
        mockTx
      );

      expect(mockCreateUserNotification).toHaveBeenCalledWith(
        userId,
        payload,
        mockTx
      );
      expect(result).toEqual({ id: '123', title: 'Test Notification' });
    });

    it('should throw error if title or message is missing', async () => {
      const userId = '1';
      const payload = {
        title: '',
        message: 'This is a test notification'
      };

      await expect(
        notificationServices.createUserNotification(userId, payload)
      ).rejects.toThrowError(
        new HttpError('Payload must include both title and message', 400)
      );
    });
  });
});
