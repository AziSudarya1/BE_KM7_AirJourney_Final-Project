import { Router } from 'express';

export default (app) => {
  const router = Router();

  app.use('/seats', router);

  router.get('/', (_req, res) => {
    return res.json({ message: 'Welcome to the Flight API!' });
  });
};
