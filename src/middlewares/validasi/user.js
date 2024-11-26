import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+62[0-9]+$/)
    .min(11)
    .max(13)
    .required()
});

export async function createUserValidation(req, res, next) {
  try {
    await createUserSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    if (Joi.isError(error)) {
      const errorMessages = generateJoiError(error);
      return res.status(400).json({ message: errorMessages });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
