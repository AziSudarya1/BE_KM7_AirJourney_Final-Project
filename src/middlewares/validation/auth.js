import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetSchema = Joi.object({
  email: Joi.string().email(),
  phone_number: Joi.string().pattern(/^\d+$/),
  password: Joi.string().required()
}).xor('email', 'phone_number');

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
    await resetSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
