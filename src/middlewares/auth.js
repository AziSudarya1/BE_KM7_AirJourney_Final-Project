import { verifyTokenAndUser } from '../services/auth.js';
import { HttpError } from '../utils/error.js';

export async function isAuthorized(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization) {
    throw new HttpError('Missing authorization header', 401);
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    throw new HttpError('Invalid authorization token', 401);
  }

  try {
    const user = await verifyTokenAndUser(token);

    res.locals.user = user;

    next();
  } catch (error) {
    throw new HttpError('invalid or expired token', 401);
  }
}

export async function isAdmin(req, res, next) {
  const user = res.locals.user;

  if (user.role !== 'ADMIN') {
    throw new HttpError('Unauthorized', 403);
  }

  next();
}
