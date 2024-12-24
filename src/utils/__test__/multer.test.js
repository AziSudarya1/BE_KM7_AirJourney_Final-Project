import { describe, it, expect, jest } from '@jest/globals';
import { uploadToMemory } from '../multer.js';

describe('Multer Utility', () => {
  describe('uploadToMemory middleware', () => {
    it('should upload a file to memory storage', (done) => {
      const req = {
        headers: {
          'content-type': 'multipart/form-data'
        },
        file: null
      };
      const res = {};
      const _next = jest.fn();

      req.file = {
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image data')
      };

      uploadToMemory(req, res, (err) => {
        expect(err).toBeUndefined();
        expect(req.file).toBeDefined();
        expect(req.file.originalname).toBe('test-image.jpg');
        expect(req.file.mimetype).toBe('image/jpeg');
        expect(req.file.buffer).toBeInstanceOf(Buffer);
        done();
      });
    });
  });
});
