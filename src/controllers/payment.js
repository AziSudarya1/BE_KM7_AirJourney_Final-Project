import * as paymentService from '../services/payment.js';

export async function initiatePayment(req, res) {
  const { transactionId } = req.body;

  const paymentUrl = await paymentService.createMidtransToken(transactionId);
  res.status(201).json({
    message: 'Payment initiated successfully',
    paymentUrl
  });
}

export async function handleWebhook(req, res) {
  try {
    const { transaction_status, order_id } = req.body;

    await paymentService.updateTransactionStatus(order_id, transaction_status);
    res.status(200).json({ message: 'Transaction status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
