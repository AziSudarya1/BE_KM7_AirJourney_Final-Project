import midtransClient from 'midtrans-client';
import { appEnv } from './env.js';
import { HttpError } from './error.js';

export const midtrans = new midtransClient.Snap({
  isProduction: appEnv.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: appEnv.MIDTRANS_SERVER_KEY,
  clientKey: appEnv.MIDTRANS_CLIENT_KEY
});

export const core = new midtransClient.CoreApi({
  isProduction: appEnv.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: appEnv.MIDTRANS_SERVER_KEY,
  clientKey: appEnv.MIDTRANS_CLIENT_KEY
});

export async function cancelMidtransTransaction(orderId) {
  const url = `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`;
  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${appEnv.MIDTRANS_TOKEN}`
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers
  });

  if (!response.ok) {
    throw new HttpError(
      `Failed to cancel transaction: ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();
  return data;
}

export const MidtransError = midtransClient.MidtransError;
