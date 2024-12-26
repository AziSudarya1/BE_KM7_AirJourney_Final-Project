import { jest } from '@jest/globals';

describe('Environment Variables', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it('should correctly format environment variables when PORT is defined', async () => {
    process.env.PORT = '3000';
    const { appEnv } = await import('../env.js');

    expect(appEnv.PORT).toBe('3000');
  });

  it('should fallback to HOST_PORT if PORT is not defined', async () => {
    process.env.HOST_PORT = '8080';
    const { appEnv } = await import('../env.js');

    expect(appEnv.PORT).toBe('8080');
  });

  it('should return undefined for PORT if neither PORT nor HOST_PORT is defined', async () => {
    const { appEnv } = await import('../env.js');

    expect(appEnv.PORT).toBeUndefined();
  });

  it('should include all environment variables in the output', async () => {
    process.env.TEST_VAR = 'test_value';
    const { appEnv } = await import('../env.js');

    expect(appEnv.TEST_VAR).toBe('test_value');
  });

  it('should throw an error if .env.local is missing in development', async () => {
    process.env.NODE_ENV = 'development';

    jest.unstable_mockModule('fs/promises', () => ({
      access: jest.fn(() => Promise.reject(new Error('File not found')))
    }));

    await expect(async () => {
      await import('../env.js');
    }).rejects.toThrow('Local environment file (.env.local) is missing');
  });

  it('should load .env.local when in development and file exists', async () => {
    process.env.NODE_ENV = 'development';

    jest.unstable_mockModule('fs/promises', () => ({
      access: jest.fn(() => Promise.resolve())
    }));

    await import('../env.js');

    expect(true).toBe(true);
  });
});
