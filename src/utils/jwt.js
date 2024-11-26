import jwt from 'jsonwebtoken';
import { appEnv } from './env.js';

export function generateToken(payload) {
  return jwt.sign(payload, appEnv.JWT_SECRET, { expiresIn: '1w' });
}

export function verifyToken(token) {
  return jwt.verify(token, appEnv.JWT_SECRET);
}
