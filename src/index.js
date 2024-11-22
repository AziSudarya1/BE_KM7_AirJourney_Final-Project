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

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(process.env.HOST_PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.HOST_PORT}`);
  });
}


main();
