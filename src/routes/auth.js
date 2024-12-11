import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authController from '../controllers/auth.js';
import * as otpController from '../controllers/otp.js';
import * as passwordResetController from '../controllers/passwordReset.js';
import * as userMiddleware from '../middlewares/user.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';
import * as authValidationMiddleware from '../middlewares/validation/auth.js';
import * as otpValidationMiddleware from '../middlewares/validation/otp.js';
import * as passwordResetValidationMiddleware from '../middlewares/validation/passwordReset.js';
import * as oauthController from '../controllers/oauth.js';
import * as oauthValidationMiddleware from '../middlewares/validation/oauth.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/register',
    userValidationMiddleware.createUserValidation,
    userMiddleware.checkUserEmailorPhoneNumberExist,
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

  router.get('/google', oauthController.getGoogleAuthorizationUrl);

  router.get(
    '/google/callback',
    oauthValidationMiddleware.isValidGoogleOauthCode,
    oauthController.authenticateWithGoogle
  );
};
