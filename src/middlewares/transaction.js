import { HttpError } from '../utils/error.js';
import * as transactionService from '../services/transaction.js';

export async function checkTransactionIdExist(req, res, next) {
  const { id } = req.params;

  const transaction = await transactionService.getTransactionById(id);

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  res.locals.transaction = transaction;

  next();
}
