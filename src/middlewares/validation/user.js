import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+[1-9][0-9]*|0[1-9][0-9]*)$/)
    .min(11)
    .required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  phoneNumber: Joi.string()
    .pattern(/^(\+[1-9][0-9]*|0[1-9][0-9]*)$/)
    .min(11)
}).min(1);

export async function createUserValidation(req, res, next) {
  try {
    await createUserSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

export async function updateUserValidation(req, res, next) {
  try {
    await updateUserSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
