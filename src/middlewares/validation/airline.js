import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createAirlineSchema = Joi.object({
  name: Joi.string().required(),
  country: Joi.string().required(),
  fleetSize: Joi.number().required()
});

export async function createAirlineValidation(req, res, next) {
  try {
    await createAirlineSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}

const updateAirlineSchema = Joi.object({
  name: Joi.string(),
  country: Joi.string(),
  fleetSize: Joi.number()
}).min(1);

export async function updateAirlineValidation(req, res, next) {
  try {
    await updateAirlineSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}
