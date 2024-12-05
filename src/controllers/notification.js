import * as notificationServices from '../services/notification.js';

export async function createNotification(req, res) {
  const data = await notificationServices.createNotification(req.body);

  res.status(200).json({
    message: 'notification created succesfully',
    data
  });
}

export async function getAllNotification(req, res) {
  const { userId } = req.params;

  const data = await notificationServices.getAllNotification(userId);

  res.status(200).json({ data });
}

export async function updateNotification(req, res) {
  const { id, userId } = req.params;

  await notificationServices.updateNotification(id, userId);

  res.status(200).json({ message: 'Notification has been read!' });
}

export async function updateAllNotification(req, res) {
  const { userId } = req.params;

  await notificationServices.updateAllNotification(userId);

  res.status(200).json({ message: 'All notifications have been read!' });
}

export async function deleteNotification(req, res) {
  const { id, userId } = req.params;

  await notificationServices.deleteNotification(id, userId);

  res.status(200).json({ message: 'Notification deleted succesfully!' });
}
