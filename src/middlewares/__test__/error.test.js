import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockNext = jest.fn();
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: class HttpError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
}));

const errorMiddleware = await import('../error.js');
const { HttpError } = await import('../../utils/error.js');

describe('error middleware', () => {
  let app;

  beforeEach(() => {
    app = { use: jest.fn() };
    errorMiddleware.default(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Middleware Registration', () => {
    it('should register notFound and errorHandler middleware', () => {
      expect(app.use).toHaveBeenCalledWith(expect.any(Function));
      expect(app.use).toHaveBeenCalledTimes(2);
    });
  });

  describe('notFound', () => {
    it('should call next with a 404 HttpError', () => {
      const mockRequest = { originalUrl: '/nonexistent-route' };

      const notFound = app.use.mock.calls[0][0];
      notFound(mockRequest, {}, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Route not found - /nonexistent-route',
          statusCode: 404
        })
      );
    });
  });

  describe('errorHandler', () => {
    const mockRequest = {};

    it('should handle HttpError and respond with the correct status and message', () => {
      const mockError = new HttpError('Test error', 400);

      const errorHandler = app.use.mock.calls[1][0];
      errorHandler(mockError, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Test error'
      });
    });

    it('should handle generic Error and respond with status 500', () => {
      const mockError = new Error('Generic error');

      const errorHandler = app.use.mock.calls[1][0];
      errorHandler(mockError, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Generic error'
      });
    });

    it('should handle unknown errors and respond with status 500 and default message', () => {
      const mockError = {};

      const errorHandler = app.use.mock.calls[1][0];
      errorHandler(mockError, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });
  });
});
