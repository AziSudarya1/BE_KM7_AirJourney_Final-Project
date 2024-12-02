import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';

export default (app) => {
  const router = Router();

  app.use('/users', router);

  router.get('/me', authMiddleware.isAuthorized, userController.getCurrentUser);

  router.put(
    '/me',
    userValidationMiddleware.updateUserValidation,
    authMiddleware.isAuthorized,
    userController.updateUserById
  );
};
