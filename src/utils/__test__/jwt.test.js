import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.unstable_mockModule('../env.js', () => {
  return {
    appEnv: {
      JWT_SECRET: 'test_secret'
    }
  };
});

const { appEnv } = await import('../env.js');
const { generateToken, verifyToken } = await import('../jwt.js');

describe('JWT Utility Functions', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token with the given payload', () => {
      const payload = { id: 1, name: 'Test User' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');
      const decoded = verifyToken(token);
      expect(decoded).toMatchObject(payload);
    });

    it('should set the token expiration to 1 week', () => {
      const payload = { id: 1 };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      const now = Math.floor(Date.now() / 1000);
      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(now + 7 * 24 * 60 * 60);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return the decoded payload', () => {
      const payload = { id: 1 };
      const token = generateToken(payload);

      const decoded = verifyToken(token);
      expect(decoded).toMatchObject(payload);
    });

    it('should throw an error for an invalid token', () => {
      const invalidToken = 'invalid.token.string';

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('should throw an error for an expired token', () => {
      const payload = { id: 1 };
      const expiredToken = jwt.sign(payload, appEnv.JWT_SECRET, {
        expiresIn: '-1s'
      });

      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
