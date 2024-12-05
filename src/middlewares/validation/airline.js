import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createAirlineSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  image: Joi.string().uri()
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
  code: Joi.string(),
  name: Joi.string(),
  image: Joi.string().uri()
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
