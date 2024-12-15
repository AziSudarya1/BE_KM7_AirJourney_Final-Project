import { describe, expect, it, jest } from '@jest/globals';

const mockGoogleAuthorizationUrl = jest.fn();
const mockAuthenticateWithGoogle = jest.fn();
const mockGetGoogleUserInfo = jest.fn();
const mockCheckOauthloginOrRegister = jest.fn();

jest.unstable_mockModule('../../services/oauth.js', () => ({
  getGoogleAuthorizationUrl: mockGoogleAuthorizationUrl,
  authenticateWithGoogle: mockAuthenticateWithGoogle,
  getGoogleUserInfo: mockGetGoogleUserInfo,
  checkOauthLoginOrRegisterUser: mockCheckOauthloginOrRegister
}));

jest.unstable_mockModule('../../utils/oauth.js', () => ({
  authorizationUrl: 'mock-authorization-url'
}));

const oauthController = await import('../oauth.js');

describe('Oauth Controller', () => {
  describe('getGoogleAuthorizationUrl', () => {
    it('should redirect to google authorization url', async () => {
      const mockRequest = {};
      const mockResponse = {
        redirect: jest.fn()
      };

      await oauthController.getGoogleAuthorizationUrl(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'mock-authorization-url'
      );
    });
  });

  describe('authenticateWithGoogle', () => {
    it('should authincate with google and return user info', async () => {
      const mockRequest = {
        query: {
          code: '123'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockAuthData = {
        id: '1',
        name: 'John Doe',
        email: '3Bt6M@example.com'
      };

      mockGetGoogleUserInfo.mockResolvedValueOnce(mockAuthData);
      mockCheckOauthloginOrRegister.mockResolvedValueOnce(mockAuthData);

      await oauthController.authenticateWithGoogle(mockRequest, mockResponse);

      expect(mockGetGoogleUserInfo).toHaveBeenCalledWith(
        mockRequest.query.code
      );
      expect(mockCheckOauthloginOrRegister).toHaveBeenCalledWith(mockAuthData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully authenticated',
        data: mockAuthData
      });
    });
  });
});
