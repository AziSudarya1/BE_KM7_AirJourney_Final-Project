import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post('/register', userController.createUser);

  router.post('/login', authController.login);
};
