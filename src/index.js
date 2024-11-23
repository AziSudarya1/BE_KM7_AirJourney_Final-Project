/* eslint-disable no-console */
import express from 'express';
import { createServer } from 'http';
import { loadEnv } from './utils/env.js';
import loaders from './loaders/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.js';

function main() {
  loadEnv();

  const app = express();
  const server = createServer(app);
  const port = process.env.PORT || process.env.HOST_PORT;

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(port, () => {
    console.log(
      `Server is running on port http://localhost:${port} in ${process.env.NODE_ENV} mode`
    );
  });
}

main();
