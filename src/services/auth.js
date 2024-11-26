import * as userRepository from '../repositories/user.js';
import { HttpError } from '../utils/error.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError('Invalid password', 401);
  }

  if (!user.verified) {
    throw new HttpError('User is not verified', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email
  });

  return {
    token,
    user: {
      name: user.name,
      role: user.role
    }
  };
};
