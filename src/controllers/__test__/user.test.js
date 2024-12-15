import { describe, expect, it, jest } from '@jest/globals';

const mockCreateUser = jest.fn();
const mockUpdateUserById = jest.fn();

jest.unstable_mockModule('../../services/user.js', () => ({
  createUser: mockCreateUser,
  updateUserById: mockUpdateUserById
}));

const userController = await import('../user.js');

describe('User Controller', () => {
  describe('createUser', () => {
    it('should call createUser controller', async () => {
      const mockRequest = {
        body: {
          name: 'John Doe',
          email: 'kiw@example.com',
          phoneNumber: '1234567890',
          password: 'password'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const user = await userController.createUser(mockRequest, mockResponse);
      expect(mockCreateUser).toHaveBeenCalledWith(
        mockRequest.body.name,
        mockRequest.body.email,
        mockRequest.body.phoneNumber,
        mockRequest.body.password
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: user
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUser controller', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: '1'
          }
        }
      };

      await userController.getCurrentUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User found successfully',
        data: {
          id: mockResponse.locals.user.id
        }
      });
    });
  });

  describe('updateUserById', () => {
    it('should call updateUserById controller', async () => {
      const mockRequest = {
        body: {
          name: 'John Doe',
          phoneNumber: '+628812432314'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: '1'
          }
        }
      };

      const userData = await userController.updateUserById(
        mockRequest,
        mockResponse
      );
      expect(mockUpdateUserById).toHaveBeenCalledWith(
        mockResponse.locals.user.id,
        {
          name: mockRequest.body.name,
          phoneNumber: mockRequest.body.phoneNumber
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Update user successfully',
        data: userData
      });
    });
  });
});
