import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { isValidGoogleOauthCode } from '../oauth.js';

describe('isValidGoogleOauthCode Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockRequest = {
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return 400 if "code" is not provided', () => {
    isValidGoogleOauthCode(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Code is required'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 if "code" is not a string', () => {
    mockRequest.query.code = 123;

    isValidGoogleOauthCode(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Code must be string'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if "code" is valid', () => {
    mockRequest.query.code = 'valid-code';

    isValidGoogleOauthCode(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
