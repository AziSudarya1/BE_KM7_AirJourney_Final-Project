import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';
import * as otpController from '../controllers/otp.js';
import * as passwordResetController from '../controllers/passwordReset.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';
import * as authValidationMiddleware from '../middlewares/validation/auth.js';
import * as passwordResetValidationMiddleware from '../middlewares/validation/passwordReset.js';

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

  router.post(
    '/reset-password/request',
    passwordResetValidationMiddleware.resetPasswordRequestValidation,
    passwordResetController.sendResetPasswordEmail
  );

  router.get(
    '/reset-password/validate/:token',
    passwordResetValidationMiddleware.validateTokenParams,
    passwordResetController.validateResetPasswordToken
  );

  router.post(
    '/reset-password',
    passwordResetValidationMiddleware.resetPasswordValidation,
    passwordResetController.resetPassword
  );
};
