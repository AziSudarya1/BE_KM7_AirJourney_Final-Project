import * as aeroplaneServices from '../services/aeroplane.js';
import { HttpError } from '../utils/error.js';

export async function checkAeroplaneById(req, res, next) {
  const { id } = req.params;

  const aeroplane = await aeroplaneServices.getAeroplaneById(id);

  if (!aeroplane) {
    throw new HttpError('Aeroplane data not Found!', 404);
  }

  next();
}
