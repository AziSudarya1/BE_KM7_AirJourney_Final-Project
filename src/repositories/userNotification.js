import { prisma } from '../utils/db.js';

export async function createUserNotification(userId, payload, tx) {
  return tx.notification.create({
    data: {
      ...payload,
      userId
    }
  });
}
