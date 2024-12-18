import { describe, expect, it, jest } from '@jest/globals';

const mockFetch = jest.fn();
const mockWriteFile = jest.fn();
const mockTranspile = jest.fn();

jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch
}));

jest.unstable_mockModule('fs/promises', () => ({
  writeFile: mockWriteFile
}));

jest.unstable_mockModule('postman2openapi', () => ({
  transpile: mockTranspile
}));

const { main } = await import('../openAPI');

describe('OpenAPI Script', () => {
  describe('main', () => {
    beforeEach(() => {
      process.env.POSTMAN_API_KEY = 'test-api-key';
      process.env.POSTMAN_COLLECTION_ID = 'test-collection-id';
      process.env.PRODUCTION_URL = 'https://production.url';
      mockFetch.mockReset();
      mockWriteFile.mockReset();
      mockTranspile.mockReset();
    });

    it('should throw an error if environment variables are invalid', async () => {
      process.env.POSTMAN_API_KEY = '';
      await expect(main()).rejects.toThrow(
        'Invalid environment variables: "POSTMAN_API_KEY" is required'
      );
    });

    it('should fetch the Postman collection and write the OpenAPI file', async () => {
      const mockCollection = { item: [] };
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ collection: mockCollection })
      };
      mockFetch.mockResolvedValue(mockResponse);
      mockTranspile.mockReturnValue({ openapi: '3.0.0' });
      mockWriteFile.mockResolvedValue();
      await main();
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.getpostman.com/collections/${process.env.POSTMAN_COLLECTION_ID}`,
        {
          headers: {
            'x-api-key': process.env.POSTMAN_API_KEY
          }
        }
      );
      expect(mockTranspile).toHaveBeenCalledWith(mockCollection);
      expect(mockWriteFile).toHaveBeenCalledWith(
        './src/docs/openAPI.json',
        expect.stringContaining('"url": "http://localhost:4000"')
      );
      expect(mockWriteFile).toHaveBeenCalledWith(
        './src/docs/openAPI.json',
        expect.stringContaining(`"url": "${process.env.PRODUCTION_URL}"`)
      );
    });

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Fetch failed'));
      await expect(main()).rejects.toThrow('Fetch failed');
    });

    it('should handle writeFile errors gracefully', async () => {
      const mockCollection = { item: [] };
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ collection: mockCollection })
      };
      mockFetch.mockResolvedValue(mockResponse);
      mockTranspile.mockReturnValue({ openapi: '3.0.0' });
      mockWriteFile.mockRejectedValue(new Error('Write failed'));
      await expect(main()).rejects.toThrow('Write failed');
    });
  });
});
