import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';
import * as otpController from '../controllers/otp.js';
import * as userValidationMiddleware from '../middlewares/validasi/user.js';
import * as authValidationMiddleware from '../middlewares/validasi/auth.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/register',
    userValidationMiddleware.createUserValidation,
    userController.createUser
  );

  router.post('/otp', otpController.sendOtp);

  router.post('/otp/verify', otpController.verifyOtp);

  router.post(
    '/login',
    authValidationMiddleware.loginValidation,
    authController.login
  );
};
