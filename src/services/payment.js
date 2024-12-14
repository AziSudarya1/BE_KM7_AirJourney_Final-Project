import { midtrans } from '../utils/midtrans.js';
import * as paymentRepository from '../repositories/payment.js';
import * as transactionRepository from '../repositories/transaction.js';
import { HttpError } from '../utils/error.js';

export async function createMidtransToken(transaction) {
  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
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

export async function updateTransactionStatus(orderId, status, method) {
  const transaction =
    await transactionRepository.getTransactionWithPaymentById(orderId);

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  let newStatus;
  if (status === 'settlement') {
    newStatus = 'SUCCESS';
  } else if (['cancel', 'expire'].includes(status)) {
    newStatus = 'CANCELLED';
  } else if (status === 'pending') {
    newStatus = 'PENDING';
  }

  await paymentRepository.updatePaymentStatusAndMethod(
    orderId,
    newStatus,
    method
  );
}
