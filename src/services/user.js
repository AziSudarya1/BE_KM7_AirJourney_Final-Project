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

export async function getUserByEmailOrPhoneNumber(email, phoneNumber) {
  const userData = await userRepository.getUserByEmailOrPhoneNumber(
    email,
    phoneNumber
  );

  return userData;
}
