import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirport = jest.fn();
const mockGetAirportById = jest.fn();
const mockUpdateAirportById = jest.fn();
const mockDeleteAirportById = jest.fn();
const mockGetAllAirports = jest.fn();

jest.unstable_mockModule('../../services/airport.js', () => ({
  createAirport: mockCreateAirport,
  getAirportById: mockGetAirportById,
  updateAirport: mockUpdateAirportById,
  deleteAirport: mockDeleteAirportById,
  getAllAirports: mockGetAllAirports
}));

const airportController = await import('../airport.js');

describe('Airport Controller', () => {
  describe('createAirport', () => {
    it('should create a new airport', async () => {
      const mockRequest = {
        body: {
          code: 'A1',
          name: 'Airport 1',
          continent: 'Asia',
          city: 'City 1',
          country: 'Country 1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await airportController.createAirport(
        mockRequest,
        mockResponse
      );

      expect(mockCreateAirport).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airport created successfully',
        data
      });
    });
  });

  describe('getAirportById', () => {
    it('should get airport by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await airportController.getAirportById(
        mockRequest,
        mockResponse
      );

      expect(mockGetAirportById).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data
      });
    });
  });

  describe('updateAirportById', () => {
    it('should update airport by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        },
        body: {
          code: 'A1',
          name: 'Airport 1',
          continent: 'Asia',
          city: 'City 1',
          country: 'Country 1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await airportController.updateAirport(
        mockRequest,
        mockResponse
      );

      expect(mockUpdateAirportById).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airport updated successfully',
        data
      });
    });
  });

  describe('deleteAirportById', () => {
    it('should delete airport by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await airportController.deleteAirport(mockRequest, mockResponse);

      expect(mockDeleteAirportById).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Airport deleted successfully'
      });
    });
  });

  describe('getAllAirports', () => {
    it('should get all airports', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await airportController.getAllAirports(
        mockRequest,
        mockResponse
      );

      expect(mockGetAllAirports).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data
      });
    });
  });
});
