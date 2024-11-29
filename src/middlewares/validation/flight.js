import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const CLASS = ['ECONOMY', 'BUSINESS', 'PREMIUM_ECONOMY', 'FIRST_CLASS'];

const flightSchema = Joi.object({
  departureDate: Joi.date().required(),
  departureTime: Joi.string().required(),
  arrivalDate: Joi.date().required(),
  arrivalTime: Joi.string().required(),
  price: Joi.number().required(),
  class: Joi.string()
    .valid(...CLASS)
    .required(),
  description: Joi.string(),
  airlineId: Joi.string().uuid().required(),
  airportIdFrom: Joi.string().uuid().required(),
  airportIdTo: Joi.string().uuid().required(),
  aeroplaneId: Joi.string().uuid().required()
});

// Change duration to arrivalTime - departureTime

export async function createFlightValidation(req, res, next) {
  try {
    await flightSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
