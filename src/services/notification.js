import * as notificationRepository from '../repositories/notification.js';
import { HttpError } from '../utils/error.js';
import * as userRepository from '../repositories/user.js';

export async function createNotification(payload) {
  const user = await userRepository.getUserById(payload.userId);

  if (!user) {
    throw new HttpError('User not found!', 404);
  }

  const data = await notificationRepository.createNotification(payload);

  return data;
}

export async function getNotificationId(id) {
  const data = await notificationRepository.checkNotificationId(id);

  return data;
}
export async function checkNotificationId(id) {
  const data = await notificationRepository.checkNotificationId(id);

  return data;
}

export async function checkUserId(userId) {
  const data = await notificationRepository.checkUserId(userId);

  return data;
}

export async function getNotification(userId) {
  const data = await notificationRepository.getNotification(userId);

  return data;
}

export async function getAllNotification(userId) {
  const data = await notificationRepository.getAllNotification(userId);

  return data;
}

export async function updateNotification(id, userId, notification) {
  if (notification.isRead) {
    throw new HttpError('Notification already read!', 400);
  }

  const data = await notificationRepository.updateNotification(id, userId);

  return data;
}

export async function updateAllNotification(userId) {
  const data = await notificationRepository.updateAllNotification(userId);

  return data;
}

export async function deleteNotification(id, userId) {
  const data = await notificationRepository.deleteNotification(id, userId);

  return data;
}

export async function createUserNotification(userId, payload, tx) {
  if (!payload.title || !payload.message) {
    throw new HttpError('Payload must include both title and message', 400);
  }

  const notification = await notificationRepository.createUserNotification(
    userId,
    payload,
    tx
  );

  return notification;
}
