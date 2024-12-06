import * as notificationServices from '../services/notification.js';

export async function createNotification(req, res) {
  const data = await notificationServices.createNotification(req.body);

  res.status(200).json({
    message: 'notification created succesfully',
    data
  });
}

export async function getAllNotification(_req, res) {
  const { userId } = res.locals.user;

  const data = await notificationServices.getAllNotification(userId);

  res.status(200).json({ data });
}

export async function updateNotification(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;

  await notificationServices.updateNotification(id, userId);

  res.status(200).json({ message: 'Notification has been read!' });
}

export async function updateAllNotification(_req, res) {
  const { userId } = res.locals.user;

  await notificationServices.updateAllNotification(userId);

  res.status(200).json({ message: 'All notifications have been read!' });
}

export async function deleteNotification(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;

  await notificationServices.deleteNotification(id, userId);

  res.status(200).json({ message: 'Notification deleted succesfully!' });
}
