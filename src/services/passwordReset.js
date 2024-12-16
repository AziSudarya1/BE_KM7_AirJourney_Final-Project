import * as userRepository from '../repositories/user.js';
import * as passwordResetRepository from '../repositories/passwordReset.js';
import { HttpError } from '../utils/error.js';
import { sendEmail } from '../utils/email/mail.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { appEnv } from '../utils/env.js';

export async function sendResetPasswordEmail(email) {
  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const data = await passwordResetRepository.getActiveTokenByUserId(user.id);

  let token = data?.token;

  if (!token) {
    token = crypto.randomUUID();

    const expiredAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await passwordResetRepository.createPasswordResetTokenByUserId(
      user.id,
      token,
      expiredAt
    );

    const url = `${appEnv.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(user.email, 'Reset Password Request', 'resetPassword', {
      url
    });
  }
}

export async function validateResetPasswordToken(token) {
  const data = await passwordResetRepository.getActiveTokenWithUser(token);

  if (!data) {
    throw new HttpError('Invalid or expired reset password token', 400);
  }

  return data;
}

export async function resetPassword(token, newPassword) {
  const data = await validateResetPasswordToken(token);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updateUserPassword(data.user.id, hashedPassword);
}
