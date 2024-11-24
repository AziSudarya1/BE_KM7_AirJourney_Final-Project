import * as userRepository from '../repositories/user.js';
import { HttpError } from '../utils/error.js';
import bcrypt from 'bcrypt';

export const createUser = async (
  name,
  email,
  phoneNumber,
  password,
  role = 'USER'
) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new HttpError('Email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userRepository.createUser({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    role
  });
};
