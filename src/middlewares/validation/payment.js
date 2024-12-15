import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const paymentSchema = Joi.object({
  transactionId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required()
});

export async function validatePaymentRequest(req, res, next) {
  try {
    await paymentSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (Joi.isError(error)) {
      const errorMessages = generateJoiError(error);
      return res.status(400).json({ message: errorMessages });
    }
    next(error);
  }
}
