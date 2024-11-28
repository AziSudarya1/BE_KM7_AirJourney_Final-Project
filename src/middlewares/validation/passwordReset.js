import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

const tokenParamsSchema = Joi.object({
  token: Joi.string().uuid().required()
});

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

export async function validateTokenParams(req, res, next) {
  try {
    await tokenParamsSchema.validateAsync(req.params, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
