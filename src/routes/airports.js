import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';
import * as airportMiddleware from '../middlewares/airport.js';
import * as airportValidationMiddleware from '../middlewares/validation/airport.js';
import * as airportController from '../controllers/airport.js';

export default (app) => {
  const router = Router();

  app.use('/airports', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    airportValidationMiddleware.createAirportValidation,
    airportMiddleware.checkAirportCodeOrNameExist,
    airportController.createAirport
  );

  router.get('/', airportController.getAllAirports);

  router.get(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    airportController.getAllAirports
  );

  router.get(
    '/:id',
    commonValidationMiddleware.validateIdParams,
    airportMiddleware.checkAirportIdExist,
    airportController.getAirportById
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    airportValidationMiddleware.updateAirportValidation,
    airportMiddleware.checkAirportIdExist,
    airportMiddleware.checkAirportCodeOrNameExist,
    airportController.updateAirport
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    commonValidationMiddleware.validateIdParams,
    airportMiddleware.checkAirportIdExist,
    airportController.deleteAirport
  );
};
