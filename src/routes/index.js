import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import user from './user.js';
import docs from './docs.js';
import aeroplane from './aeroplane.js';
import airports from './airports.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  user(router);
  root(router);
  docs(router);
  aeroplane(router);
  airports(router);
};
