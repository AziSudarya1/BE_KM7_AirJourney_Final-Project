import { Router } from 'express';
import * as paymentController from '../controllers/payment.js';
import * as midtransMiddleware from '../middlewares/midtrans.js';
import * as authKeyMiddleware from '../middlewares/authKey.js';

export default (app) => {
  const router = Router();

  app.use('/payments', router);

  router.post(
    '/webhook',
    authKeyMiddleware.validateAuthKey,
    midtransMiddleware.verifyMidtransSignature,
    paymentController.handleWebhook
  );
};
