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

export async function getDetailTransactionById(req, res) {
  const { id } = req.params;
  const { id: userId } = res.locals.user;

  const data = await transactionService.getDetailTransactionById(id, userId);

  res.status(200).json({
    message: 'Successfully get detail transaction',
    data
  });
}

export async function getAllTransactions(_req, res) {
  const userId = res.locals.user.id;
  const filter = res.locals.filter;

  const data = await transactionService.getAllTransactions(userId, filter);

  res.status(200).json({
    message: 'Successfully get all transactions',
    data
  });
}
