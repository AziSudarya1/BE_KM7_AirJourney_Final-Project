import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';
import * as otpController from '../controllers/otp.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';
import * as authValidationMiddleware from '../middlewares/validation/auth.js';
import * as otpValidationMiddleware from '../middlewares/validation/otp.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/register',
    userValidationMiddleware.createUserValidation,
    userController.createUser
  );

  router.post(
    '/otp',
    otpValidationMiddleware.sendOtpValidation,
    otpController.sendOtp
  );

  router.post(
    '/otp/verify',
    otpValidationMiddleware.verifyOtpValidation,
    otpController.verifyOtp
  );

  router.post(
    '/login',
    authValidationMiddleware.loginValidation,
    authController.login
  );
};
