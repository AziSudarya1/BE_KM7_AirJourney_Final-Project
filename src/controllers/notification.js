import * as notificationServices from '../services/notification.js';

export async function createNotification(req, res) {
  const payload = req.body;

  const data = await notificationServices.createNotification(payload);

  res.status(201).json({
    message: 'notification created succesfully',
    data
  });
}

export async function getAllNotification(_req, res) {
  const userId = res.locals.user.id;

  const data = await notificationServices.getAllNotification(userId);

  res.status(200).json({
    message: 'Get all notification succesfully',
    data
  });
}

export async function updateNotification(req, res) {
  const { id } = req.params;

  const notification = res.locals.notification;

  const { userId } = res.locals.user;

  await notificationServices.updateNotification(id, userId, notification);

  res.status(200).json({ message: 'Successfully read notification!' });
}

export async function updateAllNotification(_req, res) {
  const { id } = res.locals.user;

  await notificationServices.updateAllNotification(id);

  res.status(200).json({ message: 'Successfully read all notifications!' });
}

export async function deleteNotification(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;

  await notificationServices.deleteNotification(id, userId);

  res.status(200).json({ message: 'Notification deleted succesfully!' });
}
