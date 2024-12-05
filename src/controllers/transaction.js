import * as transactionService from '../services/transaction.js';

export async function createTransaction(req, res) {
  const user = res.locals.user;
  const { data, passengerData, seatData } = req.body;

  if (!data || !passengerData || !seatData) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  const dataTransaction = await transactionService.createTransaction(
    user.id,
    data,
    passengerData,
    seatData
  );

  res.status(201).json({
    message: 'Transaction created successfully',
    dataTransaction
  });
}
