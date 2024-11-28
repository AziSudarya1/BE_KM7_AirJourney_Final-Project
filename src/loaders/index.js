import common from './common.js';
import cors from './cors.js';
import logger from './logger.js';

export default (app, _server) => {
  common(app);
  cors(app);
  logger(app);
};
