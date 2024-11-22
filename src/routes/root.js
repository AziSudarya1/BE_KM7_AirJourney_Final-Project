import * as indexController from '../controllers/index.js';

export default (app) => {
  app.get('/', indexController.ping);
};
