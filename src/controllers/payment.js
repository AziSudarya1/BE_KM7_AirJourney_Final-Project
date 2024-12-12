import * as transactionService from '../services/transaction.js';
import * as midtransService from '../services/midtrans.js';

export async function initiatePayment(req, res) {
    const userId = res.locals.user.id;
    const { transactionId } = req.body;

    const transaction = await transactionService.getTransactionById(transactionId);

    if (!transaction || transaction.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized transaction' });
    }
    
    const snapResponse = await midtransService.createSnapTransaction(
        transaction.id,
        transaction.amount,
        { email: res.locals.user.email, name: res.locals.user.name }
    );

    await midtransService.updateSnapToken(transactionId, snapResponse.token);

    res.status(200).json({ redirect_url: snapResponse.redirect_url });
}