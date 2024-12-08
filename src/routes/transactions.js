import { Router } from 'express';
import * as transactionController from '../controllers/transaction.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as transactionValidationMiddleware from '../middlewares/validation/transaction.js';
import * as transactionMiddleware from '../middlewares/transaction.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';

export default (app) => {
  const router = Router();

  app.use('/transactions', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    transactionValidationMiddleware.createTransactionValidation,
    transactionController.createTransaction
  );

  router.get(
    '/:id',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    transactionMiddleware.checkTransactionIdExist,
    transactionController.getTransactionById
  );

  router.get(
    '/',
    authMiddleware.isAuthorized,
    transactionController.getAllTransactions
  );
};
