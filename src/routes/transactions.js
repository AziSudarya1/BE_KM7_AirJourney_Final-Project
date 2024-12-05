import { Router } from 'express';
import * as transactionController from '../controllers/transaction.js';
import * as authMiddleware from '../middlewares/auth.js';

export default (app) => {
  const router = Router();

  app.use('/transactions', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    transactionController.createTransaction
  );
};
