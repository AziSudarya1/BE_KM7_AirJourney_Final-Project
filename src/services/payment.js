import { midtrans } from '../utils/midtrans.js';
import * as paymentRepository from '../repositories/payment.js';
import * as transactionRepository from '../repositories/transaction.js';
import * as seatRepository from '../repositories/seat.js';
import * as notificationService from './notification.js';
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

export async function updateTransactionStatus(transactionId, status, method) {
  const transaction =
    await transactionRepository.getTransactionWithPassengerAndPaymentById(
      transactionId
    );

  if (!transaction) {
    throw new HttpError('Transaction not found', 404);
  }

  if (transaction.payment.expiredAt < new Date()) {
    throw new HttpError('Transaction has expired', 400);
  }

  if (transaction.payment.status !== 'PENDING') {
    throw new HttpError('Transaction already processed', 400);
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

      await notificationService.createUserNotification(
        transaction.userId,
        {
          title: 'Ticket Booking Success',
          message: 'Your ticket has been successfully booked'
        },
        tx
      );
    } else if (['cancel', 'expire'].includes(status)) {
      await seatRepository.updateSeatStatusBySeats(
        proccessedSeatIds,
        'AVAILABLE',
        tx
      );
      newStatus = 'CANCELLED';

      await notificationService.createUserNotification(
        transaction.userId,
        {
          title: 'Ticket Booking Canceled',
          message: 'Your ticket has been canceled'
        },
        tx
      );
    } else if (status === 'pending') {
      newStatus = 'PENDING';
    }

    await paymentRepository.updatePaymentStatusAndMethod(
      orderId,
      {
        status: newStatus,
        method
      },
      tx
    );
  });
}
