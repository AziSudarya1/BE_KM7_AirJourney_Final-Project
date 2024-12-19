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
const mockHttpError = jest.fn();

jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: jest.fn().mockImplementation((message, statusCode) => {
    mockHttpError(message, statusCode);

    const error = new Error(message);
    Object.setPrototypeOf(error, Error.prototype);
    error.statusCode = statusCode;
    return error;
  })
}));

jest.unstable_mockModule('../../repositories/notification.js', () => ({
  createNotification: mockCreateNotification,
  checkNotificationId: mockCheckNotificationId,
  getNotification: mockGetNotification,
  getAllNotification: mockGetAllNotification,
  updateNotification: mockUpdateNotificcation,
  updateAllNotification: mockUpdateAllNotification,
  deleteNotification: mockDeleteNotification,
  checkUserId: mockCheckUserId
}));

jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserById: mockGetUserById
}));

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
      ).rejects.toThrow('User not found!');
      expect(mockHttpError).toHaveBeenCalledWith('User not found!', 404);
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
      ).rejects.toThrow('Notification already read!');
      expect(mockHttpError).toHaveBeenCalledWith(
        'Notification already read!',
        400
      );
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
});
