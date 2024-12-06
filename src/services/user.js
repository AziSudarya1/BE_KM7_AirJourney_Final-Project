import * as userRepository from '../repositories/user.js';
import { appEnv } from '../utils/env.js';
import bcrypt from 'bcrypt';

export async function createUser(name, email, phoneNumber, password) {
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
