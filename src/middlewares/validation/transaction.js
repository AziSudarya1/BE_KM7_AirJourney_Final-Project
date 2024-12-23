import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const ALLOWED_PASSESNGER_TYPES = ['INFANT', 'CHILD', 'ADULT'];

const createPassengerSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  familyName: Joi.string(),
  birthday: Joi.date().required(),
  nationality: Joi.string().required(),
  type: Joi.string()
    .valid(...ALLOWED_PASSESNGER_TYPES)
    .required(),
  identityNumber: Joi.string().pattern(/^\d+$/).min(16).required(),
  originCountry: Joi.string().required(),
  expiredAt: Joi.date().required(),
  departureSeatId: Joi.string().uuid().when('type', {
    is: 'INFANT',
    then: Joi.forbidden(),
    otherwise: Joi.string().required()
  }),
  returnSeatId: Joi.string().uuid().when('type', {
    is: 'INFANT',
    then: Joi.forbidden(),
    otherwise: Joi.string().optional()
  })
});

const passengerArraySchema = Joi.array()
  .items(createPassengerSchema)
  .min(1)
  .required();

const createTransactionSchema = Joi.object({
  departureFlightId: Joi.string().uuid().required(),
  returnFlightId: Joi.string().uuid().disallow(Joi.ref('departureFlightId')),
  passengers: passengerArraySchema.required()
});

export async function createTransactionValidation(req, res, next) {
  try {
    await createTransactionSchema.validateAsync(req.body, {
      abortEarly: false
    });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

const queryParamSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date().when('startDate', {
    is: Joi.exist(),
    then: Joi.required()
  }),
  page: Joi.string().pattern(/^\d+$/).min(1)
});

export async function getTransactionFilterValidation(req, res, next) {
  try {
    await queryParamSchema.validateAsync(req.query, { abortEarly: false });

    const filter = {
      ...(req.query.startDate && {
        createdAt: {
          gte: new Date(req.query.startDate),
          lte: new Date(req.query.endDate)
        }
      })
    };

    res.locals.filter = filter;
    res.locals.page = Number(req?.query?.page) || 1;

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
