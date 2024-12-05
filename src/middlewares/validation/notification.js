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

const notificationIdAndUserIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required()
});

export async function validateNotificationIdAndUserIdParams(req, res, next) {
  try {
    await notificationIdAndUserIdSchema.validateAsync(req.params, {
      abortEarly: false
    });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}

const UserIdSchema = Joi.object({
  userId: Joi.string().uuid().required()
});

export async function validateUserIdParams(req, res, next) {
  try {
    await UserIdSchema.validateAsync(req.params, { abortEarly: false });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}
