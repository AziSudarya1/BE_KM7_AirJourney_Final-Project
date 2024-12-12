import midtransClient from 'midtrans-client';
import * as transactionRepository from '../repositories/transaction.js';

const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function createPayment(transactionId, amount) {
  const transaction =
    await transactionRepository.getTransactionById(transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const paymentPayload = {
    transaction_details: {
      order_id: transactionId,
      gross_amount: amount
    },
    customer_details: {
      email: transaction.user.email,
      phone: transaction.user.phoneNumber
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
