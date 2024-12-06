import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as flightValidationMiddleware from '../middlewares/validation/flight.js';
import * as flightController from '../controllers/flight.js';
import * as flightMiddleware from '../middlewares/flight.js';
import * as aeroplaneMiddleware from '../middlewares/aeroplane.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';

export default (app) => {
  const router = Router();

  app.use('/flights', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    flightValidationMiddleware.createFlightValidation,
    aeroplaneMiddleware.getAeroplaneViaBody,
    flightController.createFlight
  );

  router.get(
    '/:id',
    commonValidationMiddleware.validateIdParams,
    flightMiddleware.checkFlightIdExist,
    flightController.getFlightById
  );

  router.get(
    '/',
    flightValidationMiddleware.validateFilterAndCursorIdParams,
    flightController.getAllFlights
  );

  router.get('/favorites', authMiddleware.isAuthorized);
};
