import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    notification: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const notificationRepository = await import('../notification.js');

describe('Notification Repository', () => {
  const payload = {
    title: 'Test Notification',
    message: 'This is a test notification',
    userId: 1
  };

  const notification = {
    id: 1,
    ...payload,
    isRead: false
  };

  it('should create a notification', async () => {
    prisma.notification.create.mockResolvedValue(notification);
    const result = await notificationRepository.createNotification(payload);
    expect(result).toEqual(notification);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        title: payload.title,
        message: payload.message,
        isRead: false,
        userId: payload.userId
      }
    });
  });

  it('should check notification by id', async () => {
    prisma.notification.findUnique.mockResolvedValue(notification);
    const result = await notificationRepository.checkNotificationId(1);
    expect(result).toEqual(notification);
    expect(prisma.notification.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    });
  });

  it('should check notification by user id', async () => {
    prisma.notification.findFirst.mockResolvedValue(notification);
    const result = await notificationRepository.checkUserId(1);
    expect(result).toEqual(notification);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith({
      where: { userId: 1 }
    });
  });

  it('should get a notification by user id', async () => {
    prisma.notification.findFirst.mockResolvedValue(notification);
    const result = await notificationRepository.getNotification(1);
    expect(result).toEqual(notification);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith({
      where: { userId: 1, isRead: false }
    });
  });

  it('should get all notifications by user id', async () => {
    prisma.notification.findMany.mockResolvedValue([notification]);
    const result = await notificationRepository.getAllNotification(1);
    expect(result).toEqual([notification]);
    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 1 }
    });
  });

  it('should update a notification by id and user id', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 1 });
    const result = await notificationRepository.updateNotification(1, 1);
    expect(result).toEqual({ count: 1 });
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 },
      data: { isRead: true }
    });
  });

  it('should update all notifications by user id', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 1 });
    const result = await notificationRepository.updateAllNotification(1);
    expect(result).toEqual({ count: 1 });
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 1, isRead: false },
      data: { isRead: true }
    });
  });

  it('should delete a notification by id and user id', async () => {
    prisma.notification.delete.mockResolvedValue(notification);
    const result = await notificationRepository.deleteNotification(1, 1);
    expect(result).toEqual(notification);
    expect(prisma.notification.delete).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 }
    });
  });

  it('should create a user notification within a transaction', async () => {
    const tx = {
      notification: { create: jest.fn().mockResolvedValue(notification) }
    };
    const result = await notificationRepository.createUserNotification(
      1,
      payload,
      tx
    );
    expect(result).toEqual(notification);
    expect(tx.notification.create).toHaveBeenCalledWith({
      data: { ...payload, userId: 1 }
    });
  });
});
