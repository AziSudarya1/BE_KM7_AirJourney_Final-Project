import * as userRepository from '../repositories/user.js';
import * as passwordResetRepository from '../repositories/passwordReset.js';
import { HttpError } from '../utils/error.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email/mail.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  if (!user.verified) {
    throw new HttpError('User is not verified', 401);
  }

  const isPasswordValid = await isPasswordMatch(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError('Invalid password', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email
  });

  return {
    name: user.name,
    role: user.role,
    token: token
  };
}

export async function verifyTokenAndUser(token) {
  try {
    const { id } = verifyToken(token);

    const user = await userService.getUserWithRole(id);

    if (!user) {
      throw new HttpError('User not found', 401);
    }

    return user;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Invalid token', 401);
    }

    throw err;
  }
}

export async function isPasswordMatch(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
}

const RESET_PASSWORD_EXPIRATION_TIME = 3600;

export async function sendResetPasswordEmail(email) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const token = crypto.randomUUID();

  const expiration =
    Math.floor(Date.now() / 1000) + RESET_PASSWORD_EXPIRATION_TIME;

  await userRepository.updateResetPasswordToken(user.id, token, expiration);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(
    user.email,
    'Reset Password',
    `Click the link to reset your password: ${resetLink}`
  );
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
