import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createNotificationSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  userId: Joi.string().required()
});

export async function createNotificationValidation(req, res, next) {
  try {
    await createNotificationSchema.validateAsync(req.body, {
      abortEarly: false
    });

    next();
  } catch (err) {
    const errMessages = generateJoiError(err);
    return res.status(400).json({ message: errMessages });
  }
}
