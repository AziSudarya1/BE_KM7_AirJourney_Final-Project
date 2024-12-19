import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockUploadToMemory = jest.fn();
const mockImageKitUpload = jest.fn();

jest.unstable_mockModule('../../utils/multer.js', () => ({
  uploadToMemory: mockUploadToMemory
}));

jest.unstable_mockModule('../../utils/imagekit.js', () => ({
  imageKit: {
    upload: mockImageKitUpload
  }
}));

const uploadMiddleware = await import('../upload.js');
const { HttpError } = await import('../../utils/error.js');

describe('Image Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseImage', () => {
    const mockRequest = {};
    const mockResponse = {};
    const mockNext = jest.fn();

    it('should call next if image is successfully uploaded to memory', async () => {
      mockUploadToMemory.mockImplementation((_req, _res, callback) => {
        callback(null);
      });

      uploadMiddleware.parseImage(mockRequest, mockResponse, mockNext);

      expect(mockUploadToMemory).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        expect.any(Function)
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if there is an upload error', async () => {
      mockUploadToMemory.mockImplementation((_req, _res, callback) => {
        callback(new Error('Upload Error'));
      });

      uploadMiddleware.parseImage(mockRequest, mockResponse, mockNext);

      expect(mockUploadToMemory).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        expect.any(Function)
      );
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError('Wrong or missing key, please use "image" key.', 400)
      );
    });
  });

  describe('uploadToImageKit', () => {
    const mockRequest = {
      file: {
        originalname: 'image.png',
        buffer: Buffer.from('dummy image buffer')
      }
    };
    const mockResponse = {
      locals: {}
    };
    const mockNext = jest.fn();

    it('should upload image to ImageKit and call next', async () => {
      mockImageKitUpload.mockResolvedValue({
        url: 'https://example.com/image.png'
      });

      await uploadMiddleware.uploadToImageKit(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockImageKitUpload).toHaveBeenCalledWith({
        file: mockRequest.file.buffer,
        fileName: expect.stringMatching(/.+\.png$/)
      });
      expect(mockResponse.locals.imageUrl).toBe(
        'https://example.com/image.png'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if no file is uploaded', async () => {
      const mockRequestWithoutFile = {
        file: null
      };

      await expect(
        uploadMiddleware.uploadToImageKit(
          mockRequestWithoutFile,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(new HttpError('No image uploaded', 400));
    });
  });
});
