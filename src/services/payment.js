import { midtrans } from '../utils/midtrans.js';
import * as transactionRepository from '../repositories/transaction.js';

export async function createPayment(transactionId) {
  const transaction =
    await transactionRepository.getTransactionWithUserById(transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const paymentPayload = {
    transaction_details: {
      order_id: transactionId,
      gross_amount: transaction.amount
    },
    customer_details: {
      email: transaction.user.email
    }
  };

  const paymentResponse = await midtrans.createTransaction(paymentPayload);

  return paymentResponse.redirect_url;
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
