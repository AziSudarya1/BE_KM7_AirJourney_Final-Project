import * as transactionService from '../services/transaction.js';

export async function createTransaction(req, res) {
  const user = res.locals.user;
  const { departureFlightId, returnFlightId, passengers } = req.body;

  const dataTransaction = await transactionService.createTransaction({
    userId: user.id,
    departureFlightId,
    returnFlightId,
    passengers
  });

  res.status(201).json({
    message: 'Transaction created successfully',
    data: {
      dataTransaction,
      passengers
    }
  });
}
