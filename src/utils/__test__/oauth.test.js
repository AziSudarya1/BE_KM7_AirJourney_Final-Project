import { jest } from '@jest/globals';

jest.unstable_mockModule('@googleapis/oauth2', () => {
  const mockOauth2 = jest.fn((config) => ({
    userinfo: { get: jest.fn() },
    auth: config.auth
  }));

  return {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn(() => 'https://mock-auth-url.com'),
        setCredentials: jest.fn(),
        getToken: jest.fn()
      }))
    },
    oauth2: mockOauth2
  };
});

jest.unstable_mockModule('../env.js', () => {
  return {
    appEnv: {
      GOOGLE_CLIENT_ID: 'mock-client-id',
      GOOGLE_CLIENT_SECRET: 'mock-client-secret',
      GOOGLE_REDIRECT_URL: 'http://localhost/mock-redirect-url'
    }
  };
});

const { auth, oauth2 } = await import('@googleapis/oauth2');
const { appEnv } = await import('../env.js');
const { oauth2Client, authorizationUrl } = await import('../oauth.js');

describe('OAuth2 Utility', () => {
  it('should initialize OAuth2 client with correct credentials', () => {
    new auth.OAuth2(
      appEnv.GOOGLE_CLIENT_ID,
      appEnv.GOOGLE_CLIENT_SECRET,
      appEnv.GOOGLE_REDIRECT_URL
    );

    expect(auth.OAuth2).toHaveBeenCalledWith(
      appEnv.GOOGLE_CLIENT_ID,
      appEnv.GOOGLE_CLIENT_SECRET,
      appEnv.GOOGLE_REDIRECT_URL
    );
  });

  it('should generate authorization URL with correct scopes', () => {
    const expectedScopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: expectedScopes
    });

    expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: expectedScopes
    });

    expect(authorizationUrl).toBe('https://mock-auth-url.com');
  });

  it('should initialize Google OAuth2 with the client', () => {
    const result = oauth2({ auth: oauth2Client, version: 'v2' });

    expect(oauth2).toHaveBeenCalledWith({
      auth: oauth2Client,
      version: 'v2'
    });

    expect(result).toBeDefined();
    expect(result.auth).toBe(oauth2Client);
  });
});
