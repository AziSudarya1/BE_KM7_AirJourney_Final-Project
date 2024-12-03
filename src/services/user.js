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

export async function updateUserById(user, data) {
  const dataUser = await userRepository.updateUserById(user.id, data);

  return dataUser;
}

export async function getUserByEmailOrPhoneNumber(email, phoneNumber) {
  const userData = await userRepository.getUserByEmailOrPhoneNumber(
    email,
    phoneNumber
  );

  return userData;
}
