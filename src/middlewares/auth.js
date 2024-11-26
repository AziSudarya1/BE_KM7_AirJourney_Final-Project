import { verifyToken } from '../utils/jwt.js';
import { HttpError } from '../utils/error.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new HttpError('invalid or expired token', 401);
  }
}
