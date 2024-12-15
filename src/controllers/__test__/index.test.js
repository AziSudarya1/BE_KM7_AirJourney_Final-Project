import { describe, expect, it, jest } from '@jest/globals';

const indexController = await import('../index.js');

describe('Index Controller', () => {
  describe('ping', () => {
    it('should call ping controller', () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      indexController.ping(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Ping successfully'
      });
    });
  });
});
