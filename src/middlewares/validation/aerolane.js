import Joi from 'joi';
import { generateJoiError } from '../../utils/helper.js';

const createAeroplaneSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string().required(),
  maxRow: Joi.number().required(),
  maxColumn: Joi.number().required()
});

export async function createAeroplaneValidation(req, res, next) {
  try {
    await createAeroplaneSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}

const updateAeroplaneSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string().required(),
  maxRow: Joi.number().required(),
  maxColumn: Joi.number().required()
}).min(1);

export async function updateAeroplaneValidation(req, res, next) {
  try {
    await updateAeroplaneSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (err) {
    const errMessage = generateJoiError(err);
    return res.status(400).json({ message: errMessage });
  }
}
