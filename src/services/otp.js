import * as otpRepository from '../repositories/otp.js';
import * as userRepository from '../repositories/user.js';
import { sendEmail } from '../utils/email/mail.js';
import { generateOtp } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';

export async function sendOtp(email) {
  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  if (user.verified) {
    throw new HttpError('User is already verified', 400);
  }

  const activeOtp = await otpRepository.findActiveOtp(user.id);

  if (activeOtp) {
    throw new HttpError('An active OTP already exists', 400);
  }

  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 1 * 60 * 1000);

  const data = await otpRepository.createOtp(user.id, otp, expiredAt);

  await sendEmail(user.email, 'Your OTP Code', 'otp', {
    otp
  });

  return data;
}

export async function verifyOtp(email, otp) {
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const validOtp = await otpRepository.findValidOtp(user.id, otp);

  if (!validOtp) {
    throw new HttpError('Invalid or expired OTP', 400);
  }

  const data =
    await userRepository.updateUserVerificationMarkOtpUsedAndCreateNotification(
      user.id,
      validOtp.id
    );

  return data;
}
