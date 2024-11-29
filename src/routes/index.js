import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import user from './user.js';
import docs from './docs.js';
import flight from './flight.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  root(router);
  auth(router);
  flight(router);
  docs(router);
};
