import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirline = jest.fn();
const mockGetAirlineById = jest.fn();
const mockUpdateAirlineById = jest.fn();
const mockDeleteAirlineById = jest.fn();
const mockGetAllAirlines = jest.fn();

jest.unstable_mockModule('../../services/airline.js', () => ({
  createAirline: mockCreateAirline,
  getAirlineById: mockGetAirlineById,
  updateAirlineById: mockUpdateAirlineById,
  deleteAirlineById: mockDeleteAirlineById,
  getAllAirlines: mockGetAllAirlines
}));

const airlineController = await import('../airline.js');

describe('Airline Controller', () => {
  describe('createAirline', () => {
    it('should create a new airline', async () => {
      const mockRequest = {
        body: {
          code: 'A1',
          name: 'Airline 1',
          image: 'https://example.com/airline1.jpg'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const airlineData = await airlineController.createAirline(
        mockRequest,
        mockResponse
      );

      expect(mockCreateAirline).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airline created successfully',
        data: airlineData
      });
    });
  });

  describe('updateAirlineById', () => {
    it('should update an airline by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        },
        body: {
          code: 'A2',
          name: 'Airline 2',
          image: 'https://example.com/airline2.jpg'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const airlineData = await airlineController.updateAirline(
        mockRequest,
        mockResponse
      );

      expect(mockUpdateAirlineById).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airline updated successfully',
        data: airlineData
      });
    });
  });

  describe('getAllAirline', () => {
    it('should get all airlines', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const airlineData = await airlineController.getAllAirlines(
        mockRequest,
        mockResponse
      );

      expect(mockGetAllAirlines).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airlines retrieved successfully',
        data: airlineData
      });
    });
  });

  describe('getAirlineById', () => {
    it('should get an airline by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const airlineData = await airlineController.getAirlineById(
        mockRequest,
        mockResponse
      );

      expect(mockGetAirlineById).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airline retrieved by ID successfully',
        data: airlineData
      });
    });
  });

  describe('deleteAirlineById', () => {
    it('should delete an airline by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await airlineController.deleteAirline(mockRequest, mockResponse);

      expect(mockDeleteAirlineById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airline deleted successfully'
      });
    });
  });
});
