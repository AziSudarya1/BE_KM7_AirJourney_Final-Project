import midtransClient from 'midtrans-client';
import { appEnv } from './env.js';

export const midtrans = new midtransClient.Snap({
  isProduction: appEnv.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: appEnv.MIDTRANS_SERVER_KEY,
  clientKey: appEnv.MIDTRANS_CLIENT_KEY
});
