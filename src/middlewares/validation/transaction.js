import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';
import { HttpError } from '../../utils/error.js';

const ALLOWED_PASSESNGER_TYPES = ['INFANT', 'CHILD', 'ADULT'];

const createPassengerSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  familyName: Joi.string().required(),
  birthday: Joi.date().required(),
  nationality: Joi.string().required(),
  type: Joi.string()
    .valid(...ALLOWED_PASSESNGER_TYPES)
    .required(),
  nikPaspor: Joi.string().required(),
  nikKtp: Joi.string().required(),
  expiredAt: Joi.date().required(),
  returnSeatId: Joi.string().uuid(),
  departureSeatId: Joi.string().uuid().when('type', {
    is: 'INFANT',
    then: Joi.forbidden(),
    otherwise: Joi.required()
  }),
  returnSeatId: Joi.string().uuid().optional()
});

const passengerArraySchema = Joi.array()
  .items(createPassengerSchema)
  .min(1)
  .unique((a, b) => a.nikPaspor === b.nikPaspor || a.nikKtp === b.nikKtp)
  .required()
  .messages({
    'array.min': 'Passengers must be at least 1',
    'array.unique':
      'Passenger with the same NIK Paspor or NIK KTP is not allowed'
  });

const createTransactionSchema = Joi.object({
  departureFlightId: Joi.string().uuid(),
  returnFlightId: Joi.string().uuid(),
  passengers: passengerArraySchema
}).min(2);

export async function createTransactionValidation(req, res, next) {
  try {
    await createTransactionSchema.validateAsync(req.body, {
      abortEarly: false
    });

    const passengers = req.body.passengers;

    for (const passenger of passengers) {
      if (passenger.departureSeatId !== passengers[0].departureSeatId) {
        throw new HttpError(
          'Departure seat must be the same for all passengers',
          400
        );
      }

      if (
        passenger.returnSeatId &&
        passenger.returnSeatId !== passengers[0].returnSeatId
      ) {
        throw new HttpError(
          'Return seat must be the same for all passengers',
          400
        );
      }
    }

    next();
  } catch (error) {
    if (Joi.isError(error)) {
      const errorMessages = generateJoiError(error);
      return res.status(400).json({ message: errorMessages });
    }

    throw error;
  }
}

export async function createPassengerValidation(req, res, next) {
  try {
    await passengerArraySchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    if (Joi.isError(error)) {
      const errorMessages = generateJoiError(error);
      return res.status(400).json({ message: errorMessages });
    }

    throw error;
  }
}
