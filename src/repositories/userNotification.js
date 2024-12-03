export function createUserNotification(userId, payload, tx) {
  return tx.notification.create({
    data: {
      ...payload,
      userId
    }
  });
}
