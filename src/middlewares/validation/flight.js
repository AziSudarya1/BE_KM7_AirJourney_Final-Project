import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';
import { HttpError } from '../../utils/error.js';
import { ALLOWED_CONTINENTS } from './airport.js';

export const ALLOWED_CLASS = [
  'ECONOMY',
  'PREMIUM_ECONOMY',
  'BUSINESS',
  'FIRST_CLASS'
];

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

const ALLOWED_ORDER = ['asc', 'desc'];
const ALLOWED_SORTING = ['price', 'duration', 'departureDate', 'arrivalDate'];
const today = new Date();
today.setHours(0, 0, 0, 0);

const queryParamSchema = Joi.object({
  page: Joi.string().pattern(/^\d+$/).min(1),
  class: Joi.string().valid(...ALLOWED_CLASS),
  favourite: Joi.string().valid('true', 'false'),
  departureDate: Joi.date().min(today),
  arrivalDate: Joi.date().min(today),
  airportIdFrom: Joi.string().uuid(),
  airportIdTo: Joi.string().uuid(),
  continent: Joi.string()
    .valid(...ALLOWED_CONTINENTS)
    .when('favourite', {
      is: 'true',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),
  sortBy: Joi.string()
    .valid(...ALLOWED_SORTING)
    .when('favourite', {
      is: 'true',
      then: Joi.forbidden()
    }),
  airlineIds: Joi.array().items(Joi.string().uuid()),
  sortOrder: Joi.string()
    .valid(...ALLOWED_ORDER)
    .when('sortBy', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
});

const generateDateFilter = (date) => {
  const initialHour = new Date(date);
  initialHour.setHours(0, 0, 0, 0);

  const finishHour = new Date(date);
  finishHour.setHours(23, 59, 59, 999);

  return {
    gte: initialHour,
    lte: finishHour
  };
};

export async function validateFilterSortingAndPageParams(req, res, next) {
  try {
    const airLinesArray = req.query.airlineIds
      ? req.query.airlineIds.split(',')
      : undefined;

    await queryParamSchema.validateAsync(
      { ...req.query, airlineIds: airLinesArray },
      { abortEarly: false }
    );

    const {
      departureDate,
      arrivalDate,
      continent,
      sortBy,
      page,
      favourite,
      sortOrder,
      airlineIds,
      ...filterQuery
    } = req.query;

    const filter = {
      ...filterQuery,
      ...(departureDate && {
        departureDate: generateDateFilter(departureDate)
      }),
      ...(arrivalDate && { arrivalDate: generateDateFilter(arrivalDate) }),
      ...(continent && { airportTo: { continent: continent } }),
      ...(airlineIds && { airlineId: { in: airLinesArray } })
    };

    const sort = {
      ...(sortBy && { [sortBy]: sortOrder })
    };

    res.locals.page = Number(page) || 1;
    res.locals.filter = filter;
    res.locals.sort = sort;
    res.locals.favourite = favourite === 'true';

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}

const returnFlightIdSchema = Joi.object({
  returnFlightId: Joi.string().uuid()
});

export async function validateReturnFlightId(req, res, next) {
  try {
    await returnFlightIdSchema.validateAsync(req.query, { abortEarly: false });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}
