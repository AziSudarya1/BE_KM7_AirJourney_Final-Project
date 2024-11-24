import { Router } from 'express';
import * as otpController from '../controllers/otp.js';

export default (app) => {
  const router = Router();

  app.use('/otp', router);

  router.post('/send', otpController.sendOtp);
  router.post('/verify', otpController.verifyOtp);
};
