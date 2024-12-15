import { describe, expect, it, jest } from '@jest/globals';

const mockCreateFlight = jest.fn();
const mockGetAllFlights = jest.fn();
const mockGetFlightById = jest.fn();
const mockValidateCreateFlightIdAndGetAeroplane = jest.fn();
const mockCreateFlightAndSeat = jest.fn();

jest.unstable_mockModule('../../services/flight.js', () => ({
  createFlight: mockCreateFlight,
  getAllFlight: mockGetAllFlights,
  getFlightById: mockGetFlightById,
  validateCreateFlightIdAndGetAeroplane:
    mockValidateCreateFlightIdAndGetAeroplane,
  createFlightAndSeat: mockCreateFlightAndSeat
}));

const flightController = await import('../flight.js');

describe('flightController', () => {
  describe('createFlight', () => {
    it('should create flight', async () => {
      const mockRequest = {
        body: {
          airportIdFrom: 'from1',
          airportIdTo: 'to2',
          airlineId: 'airline3'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          aeroplane: {
            id: 'aeroplane1'
          }
        }
      };

      mockValidateCreateFlightIdAndGetAeroplane.mockResolvedValueOnce({});

      mockCreateFlightAndSeat.mockResolvedValueOnce({
        id: 'flight1',
        airportIdFrom: 'from1',
        airportIdTo: 'to2',
        airlineId: 'airline3'
      });

      await flightController.createFlight(mockRequest, mockResponse);

      expect(mockValidateCreateFlightIdAndGetAeroplane).toHaveBeenCalledWith(
        mockRequest.body.airportIdFrom,
        mockRequest.body.airportIdTo,
        mockRequest.body.airlineId
      );
      expect(mockCreateFlightAndSeat).toHaveBeenCalledWith(
        mockRequest.body,
        mockResponse.locals.aeroplane
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully create flight',
        data: {
          id: 'flight1',
          airportIdFrom: 'from1',
          airportIdTo: 'to2',
          airlineId: 'airline3'
        }
      });
    });
  });

  describe('getAllFlights', () => {
    it('should get all flights', async () => {
      const mockRequest = {
        query: {
          filter: 'filter1',
          sort: 'sort1'
        }
      };
      const mockResponse = {
        json: jest.fn(),
        locals: {
          filter: 'filter1',
          sort: 'sort1'
        }
      };

      mockGetAllFlights.mockResolvedValueOnce([
        {
          id: 'flight1',
          airportIdFrom: 'from1',
          airportIdTo: 'to2',
          airlineId: 'airline3'
        }
      ]);

      await flightController.getAllFlights(mockRequest, mockResponse);

      expect(mockGetAllFlights).toHaveBeenCalledWith(
        mockResponse.locals.filter,
        mockResponse.locals.sort
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get all flight',
        data: [
          {
            id: 'flight1',
            airportIdFrom: 'from1',
            airportIdTo: 'to2',
            airlineId: 'airline3'
          }
        ]
      });
    });
  });

  describe('getFlightById', () => {
    it('should get flight by id', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        locals: {
          flight: {
            id: 'flight1',
            airportIdFrom: 'from1',
            airportIdTo: 'to2',
            airlineId: 'airline3'
          }
        }
      };

      await flightController.getFlightById(mockRequest, mockResponse);

      mockGetFlightById.mockResolvedValueOnce({
        id: 'flight1',
        airportIdFrom: 'from1',
        airportIdTo: 'to2',
        airlineId: 'airline3'
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get flight',
        data: {
          id: 'flight1',
          airportIdFrom: 'from1',
          airportIdTo: 'to2',
          airlineId: 'airline3'
        }
      });
    });
  });
});
