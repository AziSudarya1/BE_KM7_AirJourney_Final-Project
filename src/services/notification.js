import * as notificationRepository from '../repositories/notification.js';

export async function createNotification(payload) {
  const data = await notificationRepository.createNotification(payload);

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

export async function getAllNotification(userId) {
  const data = await notificationRepository.getAllNotification(userId);

  return data;
}

export async function updateNotification(id, userId) {
  const data = await notificationRepository.updateNotification(id, userId);

  return data;
}

export async function updateAllNotification(id, userId) {
  const data = await notificationRepository.updateAllNotification(id, userId);

  return data;
}

export async function deleteNotification(id, userId) {
  const data = await notificationRepository.deleteNotification(id, userId);

  return data;
}
