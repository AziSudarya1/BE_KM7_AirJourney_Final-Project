import * as paymentService from '../services/payment.js';

export async function handleWebhook(req, res) {
  try {
    const { transaction_status, order_id } = req.body;

    await paymentService.updateTransactionStatus(order_id, transaction_status);
    res.status(200).json({ message: 'Transaction status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
