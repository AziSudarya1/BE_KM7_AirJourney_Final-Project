import { Router } from 'express';
import * as paymentController from '../controllers/payment.js';

export default (app) => {
  const router = Router();

  app.use('/payments', router);

  router.post('/notification', paymentController.handleWebhook);
};
