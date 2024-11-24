import * as otpService from '../services/otp.js';
import * as userRepository from '../repositories/user.js';
import { HttpError } from '../utils/error.js';

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    await otpService.sendOtp(user);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    await otpService.verifyOtp(user.id, otp);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};
