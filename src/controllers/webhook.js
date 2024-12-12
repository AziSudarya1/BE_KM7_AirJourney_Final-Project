import { parseNotification } from '../utils/midtrans.js';
import * as paymentService from '../services/payment.js';

export async function handleNotification(req, res) {
     
    const notification = await parseNotification(req.body);

    const { order_id, transaction_status } = notification;
    const statusMapping = {
        settlement: 'SUCCESS',
        pending: 'PENDING',
        deny: 'CANCELLED',
        cancel: 'CANCELLED',
        expire: 'CANCELLED'
    };

    await paymentService.updatePaymentStatus(order_id, statusMapping[transaction_status] || 'PENDING');

    res.status(200).json({ message: 'Notification processed successfully' });
}