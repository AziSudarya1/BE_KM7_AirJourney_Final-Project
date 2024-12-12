import { Router } from 'express';
import * as paymentController from '../controllers/payment.js';
import * as paymentValidationMiddleware from '../middlewares/validation/payment.js';
import * as midtransMiddleware from '../middlewares/midtrans.js';
import * as authMiddleware from '../middlewares/auth.js';

export default (app) => {
  const router = Router();

  app.use('/payments', router);

  router.post(
    '/initiate',
    authMiddleware.isAuthorized,
    paymentValidationMiddleware.validatePaymentRequest,
    paymentController.initiatePayment
  );

  router.post(
    '/webhook',
    midtransMiddleware.verifyMidtransSignature,
    paymentController.handleWebhook
  );
};
