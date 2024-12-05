import { HttpError } from '../utils/error.js';
import * as notificationServices from '../services/notification.js';

export async function checkNotificationIdExist(req, res, next) {
  const { id } = req.params;

  const notification = await notificationServices.checkNotificationId(id);

  if (!notification) {
    throw new HttpError('Notification id not found!', 404);
  }

  res.locals.notification = notification;

  next();
}

export async function checkUserIdExist(req, res, next) {
  const { userId } = req.params;

  const user = await notificationServices.checkUserId(userId);

  if (!userId) {
    throw new HttpError('User id not found!', 404);
  }

  res.locals.user = user;

  next();
}
