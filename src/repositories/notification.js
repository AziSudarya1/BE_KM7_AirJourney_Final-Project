import { prisma } from '../utils/db.js';

export function createNotification(payload) {
  return prisma.notification.create({
    data: {
      title: payload.title,
      message: payload.message,
      isRead: false,
      userId: payload.userId
    }
  });
}

export function checkNotificationId(id) {
  return prisma.notification.findUnique({
    where: {
      id
    }
  });
}

export function checkUserId(userId) {
  return prisma.notification.findFirst({
    where: {
      userId
    }
  });
}

export function getNotification(userId) {
  return prisma.notification.findFirst({
    where: {
      userId,
      isRead: false
    }
  });
}

export function getAllNotification(userId) {
  return prisma.notification.findMany({
    where: {
      userId
    }
  });
}

export function updateNotification(id, userId) {
  return prisma.notification.updateMany({
    where: {
      id,
      userId
    },
    data: {
      isRead: true
    }
  });
}

export function updateAllNotification(userId) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  });
}

export function deleteNotification(id, userId) {
  return prisma.notification.delete({
    where: {
      id,
      userId
    }
  });
}
