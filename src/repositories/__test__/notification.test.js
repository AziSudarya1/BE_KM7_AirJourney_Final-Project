import { describe, expect, it, jest } from '@jest/globals';

const mockCreateNotification = jest.fn();
const mockCheckNotificationId = jest.fn();
const mockCheckUserId = jest.fn();
const mockGetNotification = jest.fn();
const mockGetAllNotification = jest.fn();
const mockUpdateNotification = jest.fn();
const mockUpdateAllNotification = jest.fn();
const mockDeleteNotification = jest.fn();

jest.unstable_mockModule('../../repositories/notification.js', () => ({
  createNotification: mockCreateNotification,
  checkNotificationId: mockCheckNotificationId,
  checkUserId: mockCheckUserId,
  getNotification: mockGetNotification,
  getAllNotification: mockGetAllNotification,
  updateNotification: mockUpdateNotification,
  updateAllNotification: mockUpdateAllNotification,
  deleteNotification: mockDeleteNotification
}));

const notificationRepository = await import('../notification.js');

describe('Notification Repository', () => {
  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const mockNotification = {
        title: 'New Notification',
        message: 'This is a test notification.',
        isRead: false,
        userId: 'user-id-123'
      };

      mockCreateNotification.mockResolvedValue(mockNotification);

      const result =
        await notificationRepository.createNotification(mockNotification);

      expect(mockCreateNotification).toHaveBeenCalledWith(mockNotification);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('checkNotificationId', () => {
    it('should check and return a notification by ID', async () => {
      const mockNotification = {
        id: 'notification-id-123',
        title: 'Test Notification',
        isRead: false,
        userId: 'user-id-123'
      };

      mockCheckNotificationId.mockResolvedValue(mockNotification);

      const result = await notificationRepository.checkNotificationId(
        'notification-id-123'
      );

      expect(mockCheckNotificationId).toHaveBeenCalledWith(
        'notification-id-123'
      );
      expect(result).toEqual(mockNotification);
    });
  });

  describe('checkUserId', () => {
    it('should check and return notifications for a user by ID', async () => {
      const mockUserNotifications = [{ id: '1', title: 'Notification 1' }];

      mockCheckUserId.mockResolvedValue(mockUserNotifications);

      const result = await notificationRepository.checkUserId('user-id-123');

      expect(mockCheckUserId).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockUserNotifications);
    });
  });

  describe('getNotification', () => {
    it('should return the first unread notification for a user', async () => {
      const mockNotification = {
        id: 'notification-id-123',
        title: 'Unread Notification',
        isRead: false,
        userId: 'user-id-123'
      };

      mockGetNotification.mockResolvedValue(mockNotification);

      const result =
        await notificationRepository.getNotification('user-id-123');

      expect(mockGetNotification).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getAllNotification', () => {
    it('should return all notifications for a user', async () => {
      const mockNotifications = [
        { id: '1', title: 'Notification 1', isRead: false },
        { id: '2', title: 'Notification 2', isRead: true }
      ];

      mockGetAllNotification.mockResolvedValue(mockNotifications);

      const result =
        await notificationRepository.getAllNotification('user-id-123');

      expect(mockGetAllNotification).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('updateNotification', () => {
    it('should update a notification to mark it as read', async () => {
      const mockUpdatedNotification = { id: '1', isRead: true };

      mockUpdateNotification.mockResolvedValue(mockUpdatedNotification);

      const result = await notificationRepository.updateNotification(
        '1',
        'user-id-123'
      );

      expect(mockUpdateNotification).toHaveBeenCalledWith('1', 'user-id-123');
      expect(result).toEqual(mockUpdatedNotification);
    });
  });

  describe('updateAllNotification', () => {
    it('should mark all notifications as read for a user', async () => {
      const mockResponse = { count: 3 };

      mockUpdateAllNotification.mockResolvedValue(mockResponse);

      const result =
        await notificationRepository.updateAllNotification('user-id-123');

      expect(mockUpdateAllNotification).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification by ID for a user', async () => {
      const mockResponse = { message: 'Notification deleted successfully' };

      mockDeleteNotification.mockResolvedValue(mockResponse);

      const result = await notificationRepository.deleteNotification(
        '1',
        'user-id-123'
      );

      expect(mockDeleteNotification).toHaveBeenCalledWith('1', 'user-id-123');
      expect(result).toEqual(mockResponse);
    });
  });
});
