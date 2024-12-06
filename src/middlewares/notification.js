import { HttpError } from '../utils/error.js';
import * as notificationServices from '../services/notification.js';

export async function checkNotificationIdExist(_req, res, next) {
  const { userId } = res.locals.user;

  const notification = await notificationServices.getAllNotification(userId);

  if (!notification || notification.length === 0) {
    throw new HttpError('No notifications found for this user!', 404);
  }

  if (!notification) {
    throw new HttpError('Notification id not found!', 404);
  }

  res.locals.notification = notification;

  next();
}

export async function checkUserAccesToNotification(_req, res, next) {
  const user = res.locals.user;

  if (!user) {
    throw new HttpError('Unauthorized!', 403);
  }

  const notification = res.locals.notification;

  if (!notification) {
    throw new HttpError('Notification not found in request context!', 500);
  }

  const userNotifications = notification.filter(
    (notification) => notification.userId === user.id
  );

  if (userNotifications.length === 0) {
    throw new HttpError('Unauthorized access to these notifications', 403);
  }

  next();
}
