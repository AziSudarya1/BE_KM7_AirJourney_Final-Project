import { core, MidtransError } from '../utils/midtrans.js';
import { HttpError } from '../utils/error.js';

export async function checkMidtransTransactionValidity(transactionId) {
  try {
    if (!transactionId) {
      throw new HttpError('Transaction ID is required', 400);
    }

    const validPayload = await core.transaction.status(transactionId);
    return validPayload;
  } catch (err) {
    if (err instanceof MidtransError) {
      if (err.ApiResponse && typeof err.ApiResponse === 'object') {
        throw new HttpError(
          err.ApiResponse.status_message,
          parseInt(err.ApiResponse.status_code, 10)
        );
      }
    }

    throw err;
  }
}
