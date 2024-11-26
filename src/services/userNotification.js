import * as userNotificationRepository from '../repositories/userNotification.js';
import { prisma } from '../utils/db.js';

export async function createUserNotification(userId, payload, tx) {
  if (!payload.title || !payload.message) {
    throw new Error('Payload must include both title and message');
  }
  const notification = await userNotificationRepository.createUserNotification(
    userId,
    payload,
    tx
  );
  return notification;
}
