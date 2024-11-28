import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const sendOtp = Joi.object({
  email: Joi.string().email().required()
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required()
});

export async function sendOtpValidation(req, res, next) {
  try {
    await sendOtp.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

export async function verifyOtpValidation(req, res, next) {
  try {
    await verifyOtpSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
