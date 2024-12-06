import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import users from './users.js';
import docs from './docs.js';
import aeroplanes from './aeroplanes.js';
import airports from './airports.js';
import airlines from './airlines.js';
import notifications from './notifications.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  users(router);
  root(router);
  docs(router);
  aeroplanes(router);
  airports(router);
  airlines(router);
  notifications(router);
};
