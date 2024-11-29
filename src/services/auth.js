import * as userRepository from '../repositories/user.js';
import { HttpError } from '../utils/error.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

export async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  if (!user.verified) {
    throw new HttpError('User is not verified', 401);
  }

  const isPasswordValid = await isPasswordMatch(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError('Invalid password', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email
  });

  return {
    name: user.name,
    role: user.role,
    token: token
  };
}

export async function verifyTokenAndUser(token) {
  try {
    const { id } = verifyToken(token);

    const user = await userService.getUserWithRole(id);

    if (!user) {
      throw new HttpError('User not found', 401);
    }

    return user;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Invalid token', 401);
    }

    throw err;
  }
}

export async function isPasswordMatch(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
}
