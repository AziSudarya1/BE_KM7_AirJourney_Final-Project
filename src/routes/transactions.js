import { Router } from 'express';
import * as transactionController from '../controllers/transaction.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as transactionValidationMiddleware from '../middlewares/validation/transaction.js';

export default (app) => {
  const router = Router();

  app.use('/transactions', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    transactionValidationMiddleware.createTransactionValidation,
    // transactionValidationMiddleware.createPassengerValidation,
    transactionController.createTransaction
  );
};
