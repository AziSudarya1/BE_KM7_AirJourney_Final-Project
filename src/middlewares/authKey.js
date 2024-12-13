import { appEnv } from '../utils/env.js';

export function validateAuthKey(req, res, next) {
  const authKey = req.headers['x-auth-key'];
  const expectedKey = appEnv.MIDTRANS_AUTH_KEY;

  if (!authKey || authKey !== expectedKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Auth Key' });
  }

  next();
}
