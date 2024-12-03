import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import users from './users.js';
import docs from './docs.js';
import aeroplanes from './aeroplanes.js';
import airports from './airports.js';
import flights from './flights.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  users(router);
  root(router);
  docs(router);
  aeroplanes(router);
  airports(router);
  flights(router);
};
