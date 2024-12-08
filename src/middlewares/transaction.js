import { HttpError } from '../utils/error.js';
import * as transactionService from '../services/transaction.js';

export async function checkTransactionIdExist(req, res, next) {
  const { id } = req.params;
  const idUserActive = res.locals.user.id;

  const transaction = await transactionService.getTransactionById(id);

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  if (transaction.userId !== idUserActive) {
    throw new HttpError('You are not allowed to access this transaction', 403);
  }

  res.locals.transaction = transaction;

  next();
}
