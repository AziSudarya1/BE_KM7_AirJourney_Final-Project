import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';
import * as notificationValidationMiddleware from '../middlewares/validation/notification.js';
import * as notificationMiddleware from '../middlewares/notification.js';
import * as notificationController from '../controllers/notification.js';

export default (app) => {
  const router = Router();

  app.use('/notifications', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    notificationValidationMiddleware.createNotificationValidation,
    notificationController.createNotification
  );

  router.get(
    '/',
    authMiddleware.isAuthorized,
    notificationMiddleware.checkNotificationIdExist,
    notificationMiddleware.checkUserAccesToNotification,
    notificationController.getAllNotification
  );

  router.put(
    '/',
    authMiddleware.isAuthorized,
    notificationMiddleware.checkUserAccesToNotification,
    notificationController.updateAllNotification
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    notificationMiddleware.checkNotificationIdExist,
    notificationMiddleware.checkUserAccesToNotification,
    notificationController.updateNotification
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    notificationMiddleware.checkNotificationIdExist,
    notificationMiddleware.checkUserAccesToNotification,
    notificationController.deleteNotification
  );
};
