import cors from 'cors';
import { appEnv } from '../utils/env.js';

export const corsOptions = {
  origin: appEnv.FRONTEND_URL,
  credentials: true
};

export default (app) => {
  app.use(cors(corsOptions));
};
