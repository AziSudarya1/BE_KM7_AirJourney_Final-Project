import { prisma } from '../utils/db.js';

export const createUserNotification = async (userId, payload, tx) => {
  return prisma.notification.create({
    data: {
      ...payload,
      userId
    }
  });
};
