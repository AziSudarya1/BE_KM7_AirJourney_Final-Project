import * as otpService from '../services/otp.js';
import * as userRepository from '../repositories/user.js';
import { HttpError } from '../utils/error.js';

export async function sendOtp(req, res) {
  const { email } = req.body;

  await otpService.sendOtp(email);

  res.status(200).json({ message: 'OTP sent successfully' });
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  await otpService.verifyOtp(email, otp);

  res.status(200).json({ message: 'OTP verified successfully' });
}
