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
  const userData = await userRepository.updateUserById(userId, data);

  return userData;
}

export async function getUserByEmail(email) {
  const userData = await userRepository.getUserByEmail(email);

  return userData;
}

export async function getUserByPhoneNumber(phoneNumber) {
  const userData = await userRepository.getUserByPhoneNumber(phoneNumber);

  return userData;
}
