import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
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
