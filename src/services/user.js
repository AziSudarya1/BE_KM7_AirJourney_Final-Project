import * as userRepository from '../repositories/user.js';
import { appEnv } from '../utils/env.js';
import { generateOtp } from '../utils/helper.js';
import { sendEmail } from '../utils/email/mail.js';
import bcrypt from 'bcrypt';

export async function createUser(name, email, phoneNumber, password) {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(appEnv.BCRYPT_SALT)
  );
  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 1 * 60 * 1000);

  const payload = {
    name,
    email,
    phoneNumber,
    otp,
    expiredAt,
    password: hashedPassword
  };

  const data = await userRepository.createUser(payload);

  await sendEmail(
    email,
    'Your OTP Code',
    `Your OTP code is: ${otp}. It will expire in 1 minute.`
  );

  return data;
}

export async function updateUserById(userId, payload) {
  const data = await userRepository.updateUserById(userId, payload);

  return data;
}

export async function getUserByEmail(email) {
  const data = await userRepository.getUserByEmail(email);

  return data;
}

export async function getUserByPhoneNumber(phoneNumber) {
  const data = await userRepository.getUserByPhoneNumber(phoneNumber);

  return data;
}

export async function getUserById(userId) {
  const data = await userRepository.getUserById(userId);

  return data;
}
