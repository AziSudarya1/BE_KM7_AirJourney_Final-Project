import snap from '../utils/midtrans.js';
import { prisma } from '../utils/db.js';

export async function createPayment(transaction) {
  const paymentPayload = {
    transaction_details: {
      order_id: transaction.id,
      gross_amount: transaction.amount
    },
    customer_details: {
      email: transaction.user.email,
      first_name: transaction.user.name
    }
  };

  const payment = await snap.createTransaction(paymentPayload);
  await prisma.payment.create({
    data: {
      transactionId: transaction.id,
      paymentUrl: payment.redirect_url,
      paymentToken: payment.token,
      status: 'PENDING'
    }
  });

  return payment.redirect_url;
}

export async function updatePaymentStatus(orderId, status) {
  await prisma.payment.update({
    where: { transactionId: orderId },
    data: { status }
  });

  await prisma.transaction.update({
    where: { id: orderId },
    data: { status: status === 'settlement' ? 'PAID' : 'FAILED' }
  });
}
