import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createPassengerSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  familyName: Joi.string().required(),
  birthday: Joi.date().required(),
  nationality: Joi.string().required(),
  type: Joi.string().required(),
  nikPaspor: Joi.string().required(),
  nikKtp: Joi.string().required(),
  expiredAt: Joi.date().required(),
  departureSeatId: Joi.string().uuid().required(),
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
  returnFlightId: Joi.string().uuid().optional(),
  passengers: passengerArraySchema
}).min(2);

export async function createTransactionValidation(req, res, next) {
  try {
    await createTransactionSchema.validateAsync(req.body, {
      abortEarly: false
    });

    next();
  } catch (error) {
    if (Joi.isError(error)) {
      const errorMessages = generateJoiError(error);
      return res.status(400).json({ message: errorMessages });
    }

    res.status(500).json({ message: 'Internal server error' });
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

    res.status(500).json({ message: 'Internal server error' });
  }
}
