import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  root(router);
};
