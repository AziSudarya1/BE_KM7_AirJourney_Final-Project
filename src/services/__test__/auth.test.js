import { describe, it, expect, jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const mockGetUserByEmail = jest.fn();
const mockGetUserById = jest.fn();
const mockGenerateToken = jest.fn();
const mockVerifyToken = jest.fn();

import { HttpError } from '../../utils/error.js';

jest.unstable_mockModule('../../repositories/user.js', () => ({
  getUserByEmail: mockGetUserByEmail,
  getUserById: mockGetUserById
}));

jest.unstable_mockModule('../../utils/jwt.js', () => ({
  generateToken: mockGenerateToken,
  verifyToken: mockVerifyToken
}));

const authServices = await import('../auth.js');

describe('Auth Services', () => {
  describe('login', () => {
    it('should return user data and token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        password: await bcrypt.hash(password, 10),
        role: 'USER',
        verified: true
      };

      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockGenerateToken.mockReturnValue('validToken');

      const result = await authServices.login(email, password);

      expect(mockGetUserByEmail).toHaveBeenCalledWith(email);
      expect(mockGenerateToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email
      });
      expect(result).toEqual({
        name: mockUser.name,
        role: mockUser.role,
        token: 'validToken'
      });
    });

    it('should throw an error if user not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockGetUserByEmail.mockResolvedValue(null);

      await expect(authServices.login(email, password)).rejects.toThrowError(
        new HttpError('User not found', 404)
      );
    });

    it('should throw an error if user is not verified', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        password: await bcrypt.hash(password, 10),
        role: 'USER',
        verified: false
      };

      mockGetUserByEmail.mockResolvedValue(mockUser);

      await expect(authServices.login(email, password)).rejects.toThrowError(
        new HttpError('User is not verified', 401)
      );
    });

    it('should throw an error for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        password: await bcrypt.hash('wrongPassword', 10),
        role: 'USER',
        verified: true
      };

      mockGetUserByEmail.mockResolvedValue(mockUser);

      await expect(authServices.login(email, password)).rejects.toThrowError(
        new HttpError('Invalid password', 401)
      );
    });
  });

  describe('verifyTokenAndUser', () => {
    it('should return user data for valid token', async () => {
      const token = 'validToken';
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'test@example.com',
        role: 'USER',
        verified: true
      };

      mockVerifyToken.mockReturnValue({ id: mockUser.id });
      mockGetUserById.mockResolvedValue(mockUser);

      const result = await authServices.verifyTokenAndUser(token);

      expect(mockVerifyToken).toHaveBeenCalledWith(token);
      expect(mockGetUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      const token = 'validToken';

      mockVerifyToken.mockReturnValue({ id: '1' });
      mockGetUserById.mockResolvedValue(null);

      await expect(authServices.verifyTokenAndUser(token)).rejects.toThrowError(
        new HttpError('User not found', 401)
      );
    });

    it('should throw an error for invalid token', async () => {
      const token = 'invalidToken';

      mockVerifyToken.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await expect(authServices.verifyTokenAndUser(token)).rejects.toThrowError(
        new HttpError('Invalid token', 401)
      );
    });
  });

  describe('isPasswordMatch', () => {
    it('should return true for valid password', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await authServices.isPasswordMatch(
        password,
        hashedPassword
      );

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash('wrongPassword', 10);

      const result = await authServices.isPasswordMatch(
        password,
        hashedPassword
      );

      expect(result).toBe(false);
    });
  });
});
