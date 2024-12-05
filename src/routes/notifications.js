import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as notificationValidationMiddleware from '../middlewares/validation/notification.js';
import * as notificationMiddleware from '../middlewares/notification.js';
import * as notificationController from '../controllers/notification.js';

export default (app) => {
  const router = Router();

  app.use('/notifications', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    notificationValidationMiddleware.createNotificationValidation,
    authMiddleware.isAdmin,
    notificationController.createNotification
  );

  router.get(
    '/:userId',
    authMiddleware.isAuthorized,
    notificationValidationMiddleware.validateUserIdParams,
    notificationMiddleware.checkUserIdExist,
    notificationController.getAllNotification
  );

  router.put(
    '/:id/:userId',
    authMiddleware.isAuthorized,
    notificationValidationMiddleware.validateNotificationIdAndUserIdParams,
    notificationMiddleware.checkUserIdExist,
    notificationMiddleware.checkNotificationIdExist,
    notificationController.updateNotification
  );

  router.put(
    '/:userId',
    authMiddleware.isAuthorized,
    notificationMiddleware.checkUserIdExist,
    notificationValidationMiddleware.validateUserIdParams,
    notificationController.updateAllNotification
  );

  router.delete(
    '/:id/:userId',
    authMiddleware.isAuthorized,
    notificationValidationMiddleware.validateNotificationIdAndUserIdParams,
    notificationMiddleware.checkNotificationIdExist,
    notificationMiddleware.checkUserIdExist,
    notificationController.deleteNotification
  );
};
