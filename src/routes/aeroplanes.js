import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';
import * as aeroplaneController from '../controllers/aeroplanes.js';
import * as aeroplaneMiddleware from '../middlewares/aeroplanes.js';
import * as aeroplaneValidation from '../middlewares/validation/aeroplanes.js';

export default (app) => {
  const router = Router();

  app.use('/aeroplanes', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    aeroplaneValidation.createAeroplaneValidation,
    aeroplaneMiddleware.checkAeroplaneNameAndCodeExist,
    aeroplaneController.createAeroplane
  );

  router.get(
    '/:id',
    commonValidationMiddleware.validateIdParams,
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneController.getAeroplaneById
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    aeroplaneValidation.updateAeroplaneValidation,
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneMiddleware.checkAeroplaneNameAndCodeExist,
    aeroplaneController.updateAeroplane
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    aeroplaneMiddleware.checkAeroplaneById,
    aeroplaneController.deleteAeroplane
  );
};
