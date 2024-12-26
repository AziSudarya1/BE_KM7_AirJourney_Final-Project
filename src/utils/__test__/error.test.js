import { describe, expect, it } from '@jest/globals';

export class HttpError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

describe('HttpError Class', () => {
  describe('constructor', () => {
    it('should create an instance of HttpError with the given message and statusCode', () => {
      const message = 'Not Found';
      const statusCode = 404;

      const error = new HttpError(message, statusCode);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error instanceof HttpError).toBe(true);
    });
  });
});
