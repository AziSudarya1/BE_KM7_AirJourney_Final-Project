import { jest } from '@jest/globals';

jest.unstable_mockModule('../env.js', () => {
  return {
    appEnv: {
      IMAGEKIT_PUBLIC_KEY: 'test_public_key',
      IMAGEKIT_PRIVATE_KEY: 'test_private_key',
      IMAGEKIT_URL_ENDPOINT: 'https://test.imagekit.io/test_endpoint'
    }
  };
});

const { appEnv } = await import('../env.js');
const { imageKit } = await import('../imagekit.js');

describe('ImageKit Utility', () => {
  it('should initialize ImageKit with the correct keys and endpoint', () => {
    expect(imageKit.options.publicKey).toBe(appEnv.IMAGEKIT_PUBLIC_KEY);
    expect(imageKit.options.privateKey).toBe(appEnv.IMAGEKIT_PRIVATE_KEY);
    expect(imageKit.options.urlEndpoint).toBe(appEnv.IMAGEKIT_URL_ENDPOINT);
  });
});
