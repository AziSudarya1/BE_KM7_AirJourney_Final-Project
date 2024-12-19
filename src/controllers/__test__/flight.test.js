import { describe, expect, it, jest } from '@jest/globals';

const mockValidateCreateFlightIdAndGetAeroplane = jest.fn();
const mockCreateFlightAndSeat = jest.fn();
const mockGetAllFlight = jest.fn();

jest.unstable_mockModule('../../services/flight.js', () => ({
  validateCreateFlightIdAndGetAeroplane:
    mockValidateCreateFlightIdAndGetAeroplane,
  createFlightAndSeat: mockCreateFlightAndSeat,
  getAllFlight: mockGetAllFlight
}));

const flightController = await import('../flight.js');

describe('Flight Controller', () => {
  describe('createFlight', () => {
    it('should create a flight successfully', async () => {
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
          aeroplane: { id: 'aeroplane1' }
        }
      };

      mockValidateCreateFlightIdAndGetAeroplane.mockResolvedValueOnce();
      mockCreateFlightAndSeat.mockResolvedValueOnce({
        id: 'flight1',
        airportIdFrom: 'from1',
        airportIdTo: 'to2',
        airlineId: 'airline3'
      });

      await flightController.createFlight(mockRequest, mockResponse);

      expect(mockValidateCreateFlightIdAndGetAeroplane).toHaveBeenCalledWith(
        'from1',
        'to2',
        'airline3'
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
    it('should get all flights successfully', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        locals: {
          filter: { startDate: '2023-01-01', endDate: '2023-01-31' },
          sort: { createdAt: 'asc' },
          meta: { total: 1, currentPage: 1, totalPages: 1 },
          favourite: false
        }
      };

      const flights = [
        {
          id: 'flight1',
          airportIdFrom: 'from1',
          airportIdTo: 'to2',
          airlineId: 'airline3'
        }
      ];

      mockGetAllFlight.mockResolvedValueOnce(flights);

      await flightController.getAllFlights(mockRequest, mockResponse);

      expect(mockGetAllFlight).toHaveBeenCalledWith(
        mockResponse.locals.filter,
        mockResponse.locals.sort,
        mockResponse.locals.meta,
        mockResponse.locals.favourite
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get all flight',
        meta: mockResponse.locals.meta,
        data: flights
      });
    });
  });

  describe('getFlightById', () => {
    it('should return flight details by ID', async () => {
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

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get flight',
        data: mockResponse.locals.flight
      });
    });
  });
});
