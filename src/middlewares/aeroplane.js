import * as aeroplaneServices from '../services/aeroplane.js';
import { HttpError } from '../utils/error.js';

export async function checkAeroplaneById(req, res, next) {
  const { id } = req.params;

  const aeroplane = await aeroplaneServices.getAeroplaneById(id);

  if (!aeroplane) {
    throw new HttpError('Aeroplane data not Found!', 404);
  }

  res.locals.aeroplane = aeroplane;

  next();
}

export async function checkAeroplaneNameOrCodeExist(req, res, next) {
  const { name, code } = req.body;

  const currentAeroplane = res.locals.aeroplane;

  const skipUniqueCheckName = currentAeroplane?.name === name;

  if (name && !skipUniqueCheckName) {
    const aeroplaneName = await aeroplaneServices.getAeroplaneByName(name);

    if (aeroplaneName) {
      throw new HttpError('Aeroplane with the same name already exist!', 409);
    }
  }

  const skipUniqueCheckCode = currentAeroplane?.code === code;

  if (code && !skipUniqueCheckCode) {
    const aeroplaneCode = await aeroplaneServices.getAeroplaneByCode(code);

    if (aeroplaneCode) {
      throw new HttpError('Aeroplane with the same code already exist!', 409);
    }
  }

  next();
}

export async function getAeroplaneViaBody(req, res, next) {
  const { aeroplaneId } = req.body;

  const aeroplane = await aeroplaneServices.getAeroplaneById(aeroplaneId);

  if (!aeroplane) {
    throw new HttpError('Aeroplane data not found!', 404);
  }

  res.locals.aeroplane = aeroplane;

  next();
}
