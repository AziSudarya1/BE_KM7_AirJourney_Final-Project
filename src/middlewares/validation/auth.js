import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

export async function loginValidation(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

export async function resetPasswordRequestValidation(req, res, next) {
  try {
    await resetPasswordRequestSchema.validateAsync(req.body, {
      abortEarly: false
    });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

export async function resetPasswordValidation(req, res, next) {
  try {
    await resetPasswordSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
