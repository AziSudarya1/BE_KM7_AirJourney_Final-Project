import { HttpError } from '../utils/error.js';

export default (app) => {
  app.use(notFound);
  app.use(errorHandler);
};

function notFound(req, _res, next) {
  const notFoundError = new HttpError(
    `Route not found - ${req.originalUrl}`,
    404
  );

  next(notFoundError);
}

function errorHandler(
  err,
  _req,
  res,
  _next
) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
}
