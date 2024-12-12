import { midtrans } from '../utils/midtrans.js';
import * as transactionRepository from '../repositories/transaction.js';
import { HttpError } from '../utils/error.js';

export async function createMidtransToken(transaction) {
  if (!transaction) {
    throw new HttpError('Transaction not found');
  }

  const paymentPayload = {
    transaction_details: {
      order_id: transaction.id,
      gross_amount: transaction.amount
    },
    customer_details: {
      email: transaction.user.email
    }
  };

  const paymentResponse = await midtrans.createTransaction(paymentPayload);

  return paymentResponse;
}

export async function updateTransactionStatus(orderId, status) {
  const transaction = await transactionRepository.getTransactionById(orderId);

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  let newStatus;
  if (status === 'settlement') {
    newStatus = 'PAID';
  } else if (['cancel', 'expire'].includes(status)) {
    newStatus = 'FAILED';
  } else if (status === 'pending') {
    newStatus = 'PENDING';
  }

  await transactionRepository.updateTransactionStatus(orderId, newStatus);
}
