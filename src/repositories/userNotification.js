import { prisma } from '../utils/db.js';

export const createUserNotification = async (userId, payload, tx) => {
  return tx.notification.create({
    data: {
      ...payload,
      userId
    }
  });
};
