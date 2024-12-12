import midtransClient from 'midtrans-client';
import { appEnv } from '../utils/env.js';

const snap = new midtransClient.Snap({
  isProduction: appEnv.MIDTRANS_IS_PRODUCTION,
  clientKey: appEnv.MIDTRANS_CLIENT_KEY,
  serverKey: appEnv.MIDTRANS_SERVER_KEY
});

// const snap = new midtransClient.Snap({
//   isProduction: false,
//   clientKey: 'SB-Mid-client-LYike2ylP8lavCif',
//   serverKey: 'SB-Mid-server-Q21FZYerCGXB-pWscCGKm39x'
// });

export async function createSnapTransaction(orderId, amount, customerDetails) {
  const parameters = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: customerDetails
  };

  try {
    return await snap.createTransaction(parameters);
  } catch (error) {
    throw new Error(`Failed to create Snap transaction: ${error.message}`);
  }
}

export async function updateSnapToken(transactionId, orderDetails) {
  try {
    const parameter = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: 4000
      },
      customer_details: {
        first_name: orderDetails.firstName,
        email: orderDetails.email,
        phone: orderDetails.phoneNumber
      }
    };

    const snapResponse = await snap.createTransaction(parameter);
    return {
      snapToken: snapResponse.token,
      redirectUrl: snapResponse.redirect_url
    };
  } catch (error) {
    throw new Error(`Unable to create Snap transaction : ${error.message}`);
  }
}

export async function parseNotification(payload) {
  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
  });

  try {
    return await core.transaction.notification(payload);
  } catch (error) {
    throw new Error(`Failed to parse notification: ${error.message}`);
  }
}
