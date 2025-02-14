import { Router } from 'express';
import * as transactionController from '../controllers/transaction.js';
import * as transactionMiddleware from '../middlewares/transaction.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as transactionValidationMiddleware from '../middlewares/validation/transaction.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';

export default (app) => {
  const router = Router();

  app.use('/transactions', router);

  router.get(
    '/',
    authMiddleware.isAuthorized,
    transactionValidationMiddleware.getTransactionFilterValidation,
    transactionMiddleware.getMaxTransactionDataAndCreateMeta,
    transactionController.getAllTransactions
  );

  router.get(
    '/:id',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    transactionController.getDetailTransactionById
  );

  router.post(
    '/invalidate-expired',
    authMiddleware.getCloudSchedulerToken,
    transactionController.invalidateExpiredTransactions
  );

  router.post(
    '/',
    authMiddleware.isAuthorized,
    transactionValidationMiddleware.createTransactionValidation,
    transactionController.createTransaction
  );

  router.post(
    '/:id/cancel',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    transactionController.cancelTransaction
  );

  router.post(
    '/:id/ticket',
    authMiddleware.isAuthorized,
    commonValidationMiddleware.validateIdParams,
    transactionController.getTransactionWithFlightAndPassenger
  );
};
