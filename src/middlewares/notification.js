import { HttpError } from '../utils/error.js';
import * as notificationServices from '../services/notification.js';

export async function checkNotificationExistById(req, res, next) {
  const { id } = req.params;

  const notification = await notificationServices.checkNotificationId(id);

  if (!notification) {
    throw new HttpError('Id not found!', 404);
  }

  res.locals.notification = notification;

  next();
}

export async function checkUserHasAtLeastOneNotification(_req, res, next) {
  const { id } = res.locals.user;

  const notification = await notificationServices.getNotification(id);

  if (!notification) {
    throw new HttpError('No unread notification found!', 404);
  }

  next();
}

export async function checkNotificationByUserIdViaLocalsUser(_req, res, next) {
  const { id: userId } = res.locals.user;

  const notification = await notificationServices.getAllNotification(userId);

  if (!notification) {
    res.status(200).json({ data: notification });
  }

  next();
}

export async function checkUserAccesToNotification(_req, res, next) {
  const user = res.locals.user;

  const notification = res.locals.notification;

  if (!notification) {
    throw new HttpError('Notification not found!', 404);
  }

  const acces = user.id === notification.userId;

  if (!acces) {
    throw new HttpError('Unauthorized access to these notifications', 403);
  }

  next();
}
