import { Router } from 'express';
import * as airlineService from '../services/airline.js';

export default (app) => {
  const router = Router();

  app.use('/airlines', router);

  router.get('/', async (_req, res) => {
    const data = await airlineService.getAllAirlines();

    return res.json(data);
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await app.services.airline.getAirlineById(id);

    return res.json(data);
  });

  return router;
};
