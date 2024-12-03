import * as aeroplaneServices from '../services/aeroplane.js';
import { HttpError } from '../utils/error.js';

export async function checkAeroplaneNameOrCodeExist(req, res, next) {
  const { name, code } = req.body;
  const currentAeroplane = res.locals.aeroplane;

  const skipUniqueCheck =
    currentAeroplane?.name === name && currentAeroplane?.code === code;

  if (!skipUniqueCheck) {
    const aeroplane = await aeroplaneServices.getAeroplaneByNameOrCode(
      name,
      code
    );

    if (aeroplane) {
      throw new HttpError(
        'Aeroplane with the same name and code already exist!',
        409
      );
    }
  }

  next();
}

export async function checkAeroplaneById(req, res, next) {
  const { id } = req.params;

  const aeroplane = await aeroplaneServices.getAeroplaneById(id);

  if (!aeroplane) {
    throw new HttpError('Aeroplane data not Found!', 404);
  }

  res.locals.aeroplane = aeroplane;

  next();
}
