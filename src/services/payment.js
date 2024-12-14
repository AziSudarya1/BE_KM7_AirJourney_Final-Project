import { midtrans } from '../utils/midtrans.js';
import * as paymentRepository from '../repositories/payment.js';
import * as transactionRepository from '../repositories/transaction.js';
import * as seatRepository from '../repositories/seat.js';
import { HttpError } from '../utils/error.js';
import { prisma } from '../utils/db.js';

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
    await transactionRepository.getTransactionWithPaymentWithPassengerById(
      orderId
    );

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  const seatIds = transaction.passenger.flatMap((p) => [
    p.departureSeatId,
    p.returnSeatId
  ]);

  const proccessedSeatIds = seatIds.filter((id) => id);

  await prisma.$transaction(async (tx) => {
    let newStatus;
    if (status === 'settlement') {
      await seatRepository.updateSeatStatusBySeats(
        proccessedSeatIds,
        'BOOKED',
        tx
      );
      newStatus = 'SUCCESS';
    } else if (['cancel', 'expire'].includes(status)) {
      await seatRepository.updateSeatStatusBySeats(
        proccessedSeatIds,
        'AVAILABLE',
        tx
      );
      newStatus = 'CANCELLED';
    } else if (status === 'pending') {
      newStatus = 'PENDING';
    }

    await paymentRepository.updatePaymentStatusAndMethod(
      orderId,
      newStatus,
      method,
      tx
    );
  });
}
