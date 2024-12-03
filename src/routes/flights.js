import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as flightValidationMiddleware from '../middlewares/validation/flight.js';
import * as flightController from '../controllers/flight.js';
import * as aeroplaneMiddleware from '../middlewares/aeroplane.js';

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
};
