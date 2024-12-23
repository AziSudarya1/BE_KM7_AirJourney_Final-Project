import { jest } from '@jest/globals';
import { promises as fs } from 'fs';

jest.unstable_mockModule('dotenv', () => ({
  config: jest.fn()
}));

jest.unstable_mockModule('fs/promises', () => ({
  access: jest.fn()
}));

const dotenv = await import('dotenv');
const { loadEnv, appEnv } = await import('../env.js');

describe('Environment Utility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadEnv', () => {
    it('should load .env.local in development mode when the file exists', async () => {
      process.env.NODE_ENV = 'development';
      fs.access.mockResolvedValueOnce(); // Simulates .env.local file exists

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await loadEnv();

      expect(fs.access).toHaveBeenCalledWith('.env.local');
      expect(dotenv.config).toHaveBeenCalledWith({ path: '.env.local' });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Loading environment variables from .env.local'
      );

      consoleLogSpy.mockRestore();
    });

    it('should throw an error when .env.local is missing in development mode', async () => {
      process.env.NODE_ENV = 'development';
      fs.access.mockRejectedValueOnce(new Error('File not found')); // Simulates .env.local file does not exist

      await expect(loadEnv()).rejects.toThrow(
        'Local environment file (.env.local) is missing'
      );

      expect(fs.access).toHaveBeenCalledWith('.env.local');
      expect(dotenv.config).not.toHaveBeenCalled();
    });

    it('should load .env in non-development mode', async () => {
      process.env.NODE_ENV = 'production';

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await loadEnv();

      expect(fs.access).not.toHaveBeenCalled();
      expect(dotenv.config).toHaveBeenCalledWith({ path: undefined });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Loading environment variables from .env or process.env'
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('appEnv', () => {
    it('should format environment variables correctly', () => {
      process.env.PORT = '3000';
      process.env.HOST_PORT = '4000';

      const result = appEnv;

      expect(result.PORT).toBe('3000'); // Prefer PORT over HOST_PORT
    });

    it('should fallback to HOST_PORT if PORT is undefined', () => {
      delete process.env.PORT;
      process.env.HOST_PORT = '4000';

      const result = appEnv;

      expect(result.PORT).toBe('4000');
    });
  });
});
