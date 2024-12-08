import * as transactionService from '../services/transaction.js';

export async function createTransaction(req, res) {
  const user = res.locals.user;
  const { departureFlightId, returnFlightId, passengers } = req.body;

  const data = await transactionService.createTransaction({
    userId: user.id,
    departureFlightId,
    returnFlightId,
    passengers
  });

  res.status(201).json({
    message: 'Transaction created successfully',
    data
  });
}

export async function getTransactionById(req, res) {
  const { id } = req.params;

  const data = await transactionService.getTransactionById(id);

  res.status(200).json({
    message: 'Successfully get detail transaction',
    data
  });
}

export async function getAllTransactions(_req, res) {
  const userId = res.locals.user.id;

  const data = await transactionService.getAllTransactions(userId);

  res.status(200).json({
    message: 'Successfully get all transactions',
    data
  });
}
