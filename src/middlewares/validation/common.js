import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const idSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export async function validateIdParams(req, res, next) {
  try {
    await idSchema.validateAsync(req.params, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
