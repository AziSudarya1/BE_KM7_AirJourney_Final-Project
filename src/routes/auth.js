import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';
import * as userValidationMiddleware from '../middlewares/validasi/user.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/register',
    userValidationMiddleware.createUserValidation,
    userController.createUser
  );

  router.post('/login', authController.login);
};
