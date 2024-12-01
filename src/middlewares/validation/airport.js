import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

export const ALLOWED_CONTINENTS = [
  'ASIA',
  'EUROPE',
  'AFRICA',
  'NORTH_AMERICA',
  'SOUTH_AMERICA',
  'AUSTRALIA',
  'ANTARCTICA'
];

const createAirportSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  continent: Joi.string()
    .valid(...ALLOWED_CONTINENTS)
    .required(),
  city: Joi.string().required(),
  country: Joi.string().required()
});

export async function createAirportValidation(req, res, next) {
  try {
    await createAirportSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}

const updateAirportSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  continent: Joi.string().valid(...ALLOWED_CONTINENTS),
  city: Joi.string(),
  country: Joi.string()
}).min(1);

export async function updateAirportValidation(req, res, next) {
  try {
    await updateAirportSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessages = generateJoiError(error);
    return res.status(400).json({ message: errorMessages });
  }
}
