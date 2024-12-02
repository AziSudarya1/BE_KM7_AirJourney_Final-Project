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

export async function updateUserById(userId, data) {
  const user = await userRepository.getUserWithId(userId);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  return await userRepository.updateUserById(userId, data);
}
