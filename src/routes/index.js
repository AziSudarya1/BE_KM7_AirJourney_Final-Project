import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import user from './user.js';
import docs from './docs.js';
import airports from './airports.js';
import airline from './airline.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  user(router);
  root(router);
  docs(router);
  airports(router);
  airline(router);
};
