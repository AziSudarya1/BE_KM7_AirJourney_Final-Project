import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockGetDetailFlightById = jest.fn();
const mockCountFlightDataWithFilterAndCreateMeta = jest.fn();

jest.unstable_mockModule('../../services/flight.js', () => ({
  getDetailFlightById: mockGetDetailFlightById,
  countFlightDataWithFilterAndCreateMeta:
    mockCountFlightDataWithFilterAndCreateMeta
}));

const flightMiddleware = await import('../flight.js');
const { HttpError } = await import('../../utils/error.js');

describe('Flight Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkFlightIdExist', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if departure flight exists and no return flight', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: {}
      };

      mockGetDetailFlightById.mockResolvedValue({ id: '1' });

      await flightMiddleware.checkFlightIdExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockGetDetailFlightById).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.locals.flight.departureFlight).toEqual({ id: '1' });
    });

    it('should throw error if departure flight does not exist', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: {}
      };

      mockGetDetailFlightById.mockResolvedValue(null);

      await expect(
        flightMiddleware.checkFlightIdExist(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(new HttpError('Flight not found', 404));
    });

    it('should throw error if return flight ID is the same as departure flight ID', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: { returnFlightId: '1' }
      };

      mockGetDetailFlightById.mockResolvedValue({ id: '1' });

      await expect(
        flightMiddleware.checkFlightIdExist(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(
        new HttpError(
          'Return flight must be different from departure flight',
          400
        )
      );
    });

    it('should throw error if return flight does not exist', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: { returnFlightId: '2' }
      };

      mockGetDetailFlightById
        .mockResolvedValueOnce({
          id: '1',
          airportIdFrom: 'A',
          airportIdTo: 'B'
        })
        .mockResolvedValueOnce(null);

      await expect(
        flightMiddleware.checkFlightIdExist(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(new HttpError('Return flight not found', 404));
    });

    it('should throw error if return flight departure date is before or same as departure flight arrival date', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: { returnFlightId: '2' }
      };

      mockGetDetailFlightById
        .mockResolvedValueOnce({
          id: '1',
          airportIdFrom: 'A',
          airportIdTo: 'B',
          arrivalDate: '2023-01-01T10:00:00Z'
        })
        .mockResolvedValueOnce({
          id: '2',
          airportIdFrom: 'B',
          airportIdTo: 'A',
          departureDate: '2023-01-01T09:00:00Z'
        });

      await expect(
        flightMiddleware.checkFlightIdExist(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(
        new HttpError(
          'Return flight departure date must be after departure flight',
          400
        )
      );
    });

    it('should throw error if return flight is not the opposite of departure flight', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: { returnFlightId: '2' }
      };

      mockGetDetailFlightById
        .mockResolvedValueOnce({
          id: '1',
          airportIdFrom: 'A',
          airportIdTo: 'B',
          arrivalDate: '2023-01-01T10:00:00Z'
        })
        .mockResolvedValueOnce({
          id: '2',
          airportIdFrom: 'C',
          airportIdTo: 'D',
          departureDate: '2023-01-01T12:00:00Z'
        });

      await expect(
        flightMiddleware.checkFlightIdExist(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(
        new HttpError(
          'Return flight must be the opposite of departure flight',
          400
        )
      );
    });

    it('should call next if both departure and return flights are valid', async () => {
      const mockRequest = {
        params: { id: '1' },
        query: { returnFlightId: '2' }
      };

      mockGetDetailFlightById
        .mockResolvedValueOnce({
          id: '1',
          airportIdFrom: 'A',
          airportIdTo: 'B',
          arrivalDate: '2023-01-01T10:00:00Z'
        })
        .mockResolvedValueOnce({
          id: '2',
          airportIdFrom: 'B',
          airportIdTo: 'A',
          departureDate: '2023-01-01T12:00:00Z'
        });

      await flightMiddleware.checkFlightIdExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.locals.flight.departureFlight).toEqual({
        id: '1',
        airportIdFrom: 'A',
        airportIdTo: 'B',
        arrivalDate: '2023-01-01T10:00:00Z'
      });
      expect(mockResponse.locals.flight.returnFlight).toEqual({
        id: '2',
        airportIdFrom: 'B',
        airportIdTo: 'A',
        departureDate: '2023-01-01T12:00:00Z'
      });
    });
  });

  describe('getMaxFlightDataAndCreateMeta', () => {
    const mockResponse = {
      locals: {
        filter: { destination: 'NYC' },
        page: 1,
        favourite: false
      }
    };

    const mockNext = jest.fn();

    it('should call next and set meta in locals', async () => {
      const mockMeta = {
        total: 100,
        currentPage: 1,
        totalPages: 10
      };

      mockCountFlightDataWithFilterAndCreateMeta.mockResolvedValue(mockMeta);

      await flightMiddleware.getMaxFlightDataAndCreateMeta(
        {},
        mockResponse,
        mockNext
      );

      expect(mockCountFlightDataWithFilterAndCreateMeta).toHaveBeenCalledWith(
        { destination: 'NYC' },
        1,
        false
      );
      expect(mockResponse.locals.meta).toEqual(mockMeta);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
