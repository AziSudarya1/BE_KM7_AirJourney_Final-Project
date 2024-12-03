import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';
import * as airlineController from '../controllers/airline.js';
import * as airlineMiddleware from '../middlewares/airline.js';
import * as airlineValidation from '../middlewares/validation/airline.js';

export default (app) => {
  const router = Router();
  app.use('/airlines', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    airlineValidation.createAirlineValidation,
    airlineMiddleware.checkAirlineNameExist,
    airlineController.createAirline
  );

  router.get(
    '/:id',
    airlineMiddleware.checkAirlineById,
    airlineController.getAirlineById
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    airlineValidation.updateAirlineValidation,
    airlineMiddleware.checkAirlineById,
    airlineController.updateAirline
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    airlineMiddleware.checkAirlineById,
    airlineController.deleteAirline
  );
};
