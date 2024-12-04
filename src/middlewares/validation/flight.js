import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';
import { HttpError } from '../../utils/error.js';

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
  aeroplaneId: Joi.string().uuid().required(),
  duration: Joi.number().required()
});

export async function createFlightValidation(req, res, next) {
  try {
    await createFlightSchema.validateAsync(req.body, { abortEarly: false });

    const expiredDate = new Date(req.body.departureDate) < new Date();

    if (expiredDate) {
      throw new HttpError('Departure date must be in the future', 400);
    }

    const invalidDate =
      new Date(req.body.departureDate) > new Date(req.body.arrivalDate);

    if (invalidDate) {
      throw new HttpError('Departure date must be before arrival date', 400);
    }

    next();
  } catch (err) {
    if (err.isJoi) {
      const errMessage = generateJoiError(err);
      return res.status(400).json({ message: errMessage });
    }
    next(err);
  }
}

const queryParamSchema = Joi.object({
  cursorId: Joi.string().uuid(),
  class: Joi.string().valid(...ALLOWED_CLASS),
  departureDate: Joi.date(),
  arrivalDate: Joi.date(),
  airportIdFrom: Joi.string().uuid(),
  airportIdTo: Joi.string().uuid()
});

export async function validateFilterAndCursorIdParams(req, res, next) {
  try {
    await queryParamSchema.validateAsync(req.query, { abortEarly: false });

    const filter = { ...req.query };

    if (req.query.departureDate) {
      filter.departureDate = new Date(req.query.departureDate);
    }

    if (req.query.arrivalDate) {
      filter.arrivalDate = new Date(req.query.arrivalDate);
    }

    res.locals.filter = filter;

    next();
  } catch (err) {
    if (err.isJoi) {
      const errMessage = generateJoiError(err);
      return res.status(400).json({ message: errMessage });
    }
    next(err);
  }
}
