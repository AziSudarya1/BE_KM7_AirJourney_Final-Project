import * as userRepository from '../repositories/user.js';
import { appEnv } from '../utils/env.js';
import { HttpError } from '../utils/error.js';
import bcrypt from 'bcrypt';

export async function createUser(name, email, phoneNumber, password) {
  const existingUser = await userRepository.findUserByEmail(email);
  const existingPhoneNumber =
    await userRepository.findUserByPhoneNumber(phoneNumber);

  if (existingUser) {
    throw new HttpError('Email already exists', 409);
  }

  if (existingPhoneNumber) {
    throw new HttpError('Phone number already exists', 409);
  }

  if (!name || !email || !phoneNumber || !password) {
    throw new HttpError('All fields are required', 400);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(appEnv.BCRYPT_SALT)
  );

  return await userRepository.createUser({
    name,
    email,
    phoneNumber,
    password: hashedPassword
  });
}
