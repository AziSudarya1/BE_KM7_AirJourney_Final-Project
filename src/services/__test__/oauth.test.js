import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

const mockOauth2Client = {
  getToken: jest.fn(),
  setCredentials: jest.fn()
};

const mockOauth2 = {
  userinfo: {
    get: jest.fn()
  }
};

jest.unstable_mockModule('../../utils/oauth.js', () => ({
  oauth2: mockOauth2,
  oauth2Client: mockOauth2Client
}));

const mockGenerateToken = jest.fn();
jest.unstable_mockModule('../../utils/jwt.js', () => ({
  generateToken: mockGenerateToken
}));

const mockGetUserByEmail = jest.fn();
const mockCreateNotificationAndVerifiedUser = jest.fn();
const mockUpdateVerifiedUserAndCreateNotification = jest.fn();
jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserByEmail: mockGetUserByEmail,
  createNotificationAndVerifiedUser: mockCreateNotificationAndVerifiedUser,
  updateVerifiedUserAndCreateNotification:
    mockUpdateVerifiedUserAndCreateNotification
}));

const {
  getGoogleUserInfo,
  createVerifiedUserWithNotifications,
  updateVerifiedUserWithNotification,
  checkOauthLoginOrRegisterUser
} = await import('../oauth.js');

describe('OAuth Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGoogleUserInfo', () => {
    it('should return user info from Google', async () => {
      const code = 'test-code';
      const tokens = { access_token: 'test-token' };
      const userInfo = { email: 'test@example.com', name: 'Test User' };

      mockOauth2Client.getToken.mockResolvedValue({ tokens });
      mockOauth2Client.setCredentials.mockImplementation();
      mockOauth2.userinfo.get.mockResolvedValue({ data: userInfo });

      const result = await getGoogleUserInfo(code);

      expect(mockOauth2Client.getToken).toHaveBeenCalledWith(code);
      expect(mockOauth2Client.setCredentials).toHaveBeenCalledWith(tokens);
      expect(mockOauth2.userinfo.get).toHaveBeenCalled();
      expect(result).toEqual(userInfo);
    });
  });

  describe('createVerifiedUserWithNotifications', () => {
    it('should create a verified user with notifications', async () => {
      const payload = { email: 'test@example.com', name: 'Test User' };
      const user = { id: 'user-id', ...payload };

      mockCreateNotificationAndVerifiedUser.mockResolvedValue(user);

      const result = await createVerifiedUserWithNotifications(payload);

      expect(mockCreateNotificationAndVerifiedUser).toHaveBeenCalledWith(
        payload
      );
      expect(result).toEqual(user);
    });
  });

  describe('updateVerifiedUserWithNotification', () => {
    it('should update a verified user with notification', async () => {
      const userId = 'user-id';
      const user = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        verified: false
      };

      mockUpdateVerifiedUserAndCreateNotification.mockResolvedValue(user);

      const result = await updateVerifiedUserWithNotification(userId);

      expect(mockUpdateVerifiedUserAndCreateNotification).toHaveBeenCalledWith(
        userId
      );
      expect(result).toEqual(user);
    });
  });

  describe('checkOauthLoginOrRegisterUser', () => {
    it('should throw an error if email or name is empty', async () => {
      const data = { email: '', name: '', picture: 'test-picture' };

      await expect(checkOauthLoginOrRegisterUser(data)).rejects.toThrowError(
        new HttpError('Email or name is empty', 400)
      );
    });

    it('should create a new verified user if user does not exist', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'test-picture'
      };
      const user = { id: 'user-id', ...data };

      mockGetUserByEmail.mockResolvedValue(null);
      mockCreateNotificationAndVerifiedUser.mockResolvedValue(user);
      mockGenerateToken.mockReturnValue('test-token');

      const result = await checkOauthLoginOrRegisterUser(data);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(mockCreateNotificationAndVerifiedUser).toHaveBeenCalledWith({
        name: data.name,
        email: data.email,
        image: data.picture
      });
      expect(mockGenerateToken).toHaveBeenCalledWith({
        id: user.id,
        email: data.email
      });
      expect(result).toEqual({ ...user, token: 'test-token' });
    });

    it('should update a verified user if user exists but not verified', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'test-picture'
      };
      const user = { id: 'user-id', ...data, verified: false };

      mockGetUserByEmail.mockResolvedValue(user);
      mockUpdateVerifiedUserAndCreateNotification.mockResolvedValue({
        ...user,
        verified: true,
        email: data.email,
        name: data.name,
        image: data.picture
      });
      mockGenerateToken.mockReturnValue('test-token');

      const result = await checkOauthLoginOrRegisterUser(data);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(mockUpdateVerifiedUserAndCreateNotification).toHaveBeenCalledWith(
        user.id
      );

      expect(mockGenerateToken).toHaveBeenCalledWith({
        id: user.id,
        email: data.email
      });
      expect(result).toEqual({
        ...user,
        image: data.picture,
        verified: true,
        token: 'test-token'
      });
    });

    it('should return existing user if user exists and is verified', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'test-picture'
      };
      const user = { id: 'user-id', ...data, verified: true };

      mockGetUserByEmail.mockResolvedValue(user);
      mockGenerateToken.mockReturnValue('test-token');

      const result = await checkOauthLoginOrRegisterUser(data);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(mockGenerateToken).toHaveBeenCalledWith({
        id: user.id,
        email: data.email
      });
      expect(result).toEqual({ ...user, token: 'test-token' });
    });
  });
});
