import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as aeroplaneController from '../controllers/aeroplane.js';
import * as aeroplaneMiddleware from '../middlewares/aeroplane.js';
import * as aeroplaneValidation from '../middlewares/validation/aerolane.js';

export default (app) => {
  const router = Router();

  app.use('/aeroplane', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    aeroplaneValidation.createAeroplaneValidation,
    aeroplaneController.createAeroplane
  );

  router.get(
    '/:id',
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneController.getAeroplaneById
  );

  router.put(
    '/:id',
    aeroplaneValidation.updateAeroplaneValidation,
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneController.updateAeroplane
  );

  router.delete(
    '/:id',
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneController.deleteAeroplane
  );
};
