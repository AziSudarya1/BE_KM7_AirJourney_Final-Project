import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import docs from './docs.js';
import flight from './flight.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  root(router);
  auth(router);
  root(router);
  docs(router);
};
