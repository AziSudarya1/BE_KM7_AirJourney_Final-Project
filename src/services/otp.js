import * as otpRepository from '../repositories/otp.js';
import * as userRepository from '../repositories/user.js';
// import { sendEmail } from '../utils/email/mail.js';
import { generateOtp } from '../utils/otp/generateOtp.js';
import { HttpError } from '../utils/error.js';
import nodemailer from 'nodemailer';

export const sendOtp = async (user) => {
  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 1 * 60 * 1000);
  const activeOtp = await otpRepository.findActiveOtp(user.id);

  await otpRepository.createOtp(user.id, otp, expiredAt);

  if (activeOtp) {
    throw new HttpError('An active OTP already exists', 400);
  }

  if (user.verified) {
    throw new HttpError('User is already verified', 400);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 1 minute.`
  });

  return 'OTP sent successfully';
};

export const verifyOtp = async (userId, otp) => {
  const validOtp = await otpRepository.findValidOtp(userId, otp);

  if (!validOtp) {
    throw new HttpError('Invalid or expired OTP', 400);
  }

  await otpRepository.markOtpAsUsed(validOtp.id);

  await userRepository.updateUserVerification(userId);
};
