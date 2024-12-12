import { Router } from 'express';
import * as paymentController from '../controllers/payment.js';
import * as paymentValidation from '../middlewares/validation/payment.js';
import { verifyMidtransSignature } from '../middlewares/webhookVerifier.js';
import * as authMiddleware from '../middlewares/auth.js';

export default (app) => {
  const router = Router();

  app.use('/payments', router);

  router.post(
    '/initiate',
    authMiddleware.isAuthorized,
    paymentValidation.validatePaymentRequest,
    paymentController.initiatePayment
  );

  router.post(
    '/webhook',
    verifyMidtransSignature,
    paymentController.handleWebhook
  );
};