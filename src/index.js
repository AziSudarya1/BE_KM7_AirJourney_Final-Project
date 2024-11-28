/* eslint-disable no-console */
import express from 'express';
import { createServer } from 'http';
import { appEnv } from './utils/env.js';
import loaders from './loaders/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.js';

function main() {
  const app = express();
  const server = createServer(app);
  const port = appEnv.PORT;

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(port, () => {
    console.log(
      `Server is running on port http://localhost:${port} in ${process.env.NODE_ENV} mode`
    );

    console.log(`API Docs: http://localhost:${port}/docs`);
  });
}

main();
