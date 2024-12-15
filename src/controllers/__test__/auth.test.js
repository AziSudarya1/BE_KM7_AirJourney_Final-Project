import { describe, expect, it, jest } from '@jest/globals';

const mockLogin = jest.fn();

jest.unstable_mockModule('../../services/auth.js', () => ({
  login: mockLogin
}));

const authController = await import('../auth.js');

describe('Auth Controller', () => {
  describe('login', () => {
    it('should call login service', async () => {
      const req = {
        body: {
          email: 'kiw@example.com',
          password: 'password'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await authController.login(req, res);
      expect(mockLogin).toHaveBeenCalledWith('kiw@example.com', 'password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful'
      });
    });
  });
});
