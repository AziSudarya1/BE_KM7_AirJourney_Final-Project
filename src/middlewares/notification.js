import { HttpError } from '../utils/error.js';
import * as notificationServices from '../services/notification.js';

export async function checkNotificationExistById(req, res, next) {
  const { id } = req.params;

  const notification = await notificationServices.checkNotificationId(id);

  if (!notification) {
    throw new HttpError('Notification not found!', 404);
  }

  res.locals.notification = notification;

  next();
}

export async function checkUserHasAtLeastOneNotification(_req, res, next) {
  const userId = res.locals.user.id;

  const notification = await notificationServices.getNotification(userId);

  if (!notification) {
    throw new HttpError('No unread notification found!', 404);
  }

  next();
}

export async function checkUserAccesToNotification(_req, res, next) {
  const user = res.locals.user;

  const notification = res.locals.notification;

  const access = user.id === notification.userId;

  if (!access) {
    throw new HttpError('Unauthorized access to these notifications', 403);
  }

  next();
}
