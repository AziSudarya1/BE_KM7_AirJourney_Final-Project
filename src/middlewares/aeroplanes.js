import * as aeroplaneServices from '../services/aeroplanes.js';
import { HttpError } from '../utils/error.js';

export async function checkAeroplaneNameAndCodeExist(req, res, next) {
  const { name, code } = req.body;

  const aeroplane = await aeroplaneServices.getAeroplaneByNameAndCode(
    name,
    code
  );

  if (aeroplane) {
    throw new HttpError(
      'Aeroplane with the same name and code already exist!',
      409
    );
  }

  next();
}

export async function checkAeroplaneById(req, res, next) {
  const { id } = req.params;

  const aeroplane = await aeroplaneServices.getAeroplaneById(id);

  if (!aeroplane) {
    throw new HttpError('Aeroplane data not Found!', 404);
  }

  next();
}
