import { json } from 'express';

export default (app) => {
  app.use(json());
};
