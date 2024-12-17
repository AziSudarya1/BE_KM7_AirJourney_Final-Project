import { describe, expect, it, jest } from '@jest/globals';

const uploadController = await import('../upload.js');

describe('Upload Controller', () => {
  describe('uploadImage', () => {
    it('should call uploadImage controller', () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          imageUrl: 'imageUrl'
        }
      };

      uploadController.uploadImage(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Image uploaded successfully',
        data: {
          imageUrl: mockResponse.locals.imageUrl
        }
      });
    });
  });
});
