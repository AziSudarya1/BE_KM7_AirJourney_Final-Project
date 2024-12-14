import * as paymentService from '../services/payment.js';
import * as midtransService from '../services/midtrans.js';

export async function handleWebhook(req, res) {
  const { transaction_id } = req.body;

  const validPayload =
    await midtransService.checkMidtransTransactionValidity(transaction_id);

  const { transaction_status, order_id, payment_type } = validPayload;

  await paymentService.updateTransactionStatus(
    order_id,
    transaction_status,
    payment_type
  );

  res.status(200).json({ message: 'Transaction status updated' });
}
