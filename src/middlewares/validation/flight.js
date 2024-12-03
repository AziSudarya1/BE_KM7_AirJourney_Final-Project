import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const ALLOWED_CLASS = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'];

const createFlightSchema = Joi.object({
  departureDate: Joi.date().required(),
  arrivalDate: Joi.date().required(),
  arrivalTime: Joi.string().required(),
  departureTime: Joi.string().required(),
  price: Joi.number().required(),
  class: Joi.string()
    .valid(...ALLOWED_CLASS)
    .required(),
  description: Joi.string(),
  airlineId: Joi.string().uuid().required(),
  airportIdFrom: Joi.string().uuid().required(),
  airportIdTo: Joi.string().uuid().required(),
  aeroplaneId: Joi.string().uuid().required()
});

export async function createFlightValidation(req, res, next) {
  try {
    await createFlightSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}
