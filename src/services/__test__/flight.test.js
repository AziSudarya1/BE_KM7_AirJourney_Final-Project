import { describe, expect, it, jest } from '@jest/globals';

const mockHttpError = jest.fn();

jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: jest.fn().mockImplementation((message, statusCode) => {
    mockHttpError(message, statusCode);

    const error = new Error(message);
    Object.setPrototypeOf(error, Error.prototype);
    error.statusCode = statusCode;
    return error;
  })
}));

// Mock repositories flight
const mockCreateFlight = jest.fn();
const mockGetAllFlights = jest.fn();
const mockGetFlightById = jest.fn();
const mockGetDetailFlightById = jest.fn();
const mockGetFlightWithSeatsById = jest.fn();
const mockCreateFlightAndSeat = jest.fn();

jest.unstable_mockModule('../../repositories/flight.js', () => ({
  createFlight: mockCreateFlight,
  getAllFlight: mockGetAllFlights,
  getFlightById: mockGetFlightById,
  getDetailFlightById: mockGetDetailFlightById,
  getFlightWithSeatsById: mockGetFlightWithSeatsById,
  createFlightAndSeat: mockCreateFlightAndSeat
}));

const mockGetAirportById = jest.fn();
jest.unstable_mockModule('../../repositories/airport.js', () => ({
  getAirportById: mockGetAirportById
}));

const mockGetAirlineById = jest.fn();
jest.unstable_mockModule('../../repositories/airline.js', () => ({
  getAirlineById: mockGetAirlineById
}));

const mockGenerateSeats = jest.fn();
jest.unstable_mockModule('../../scripts/generateSeats.js', () => ({
  generateSeats: jest.fn((maxRow, maxColumn, aeroplaneId) => {
    mockGenerateSeats(maxRow, maxColumn, aeroplaneId);

    const seats = [];
    for (let i = 0; i < maxRow; i++) {
      for (let j = 0; j < maxColumn; j++) {
        const seat = {
          row: i + 1,
          column: j + 1,
          status: 'AVAILABLE',
          aeroplaneId
        };
        seats.push(seat);
      }
    }
    return seats;
  })
}));

const flightService = await import('../flight.js');

describe('Flight Services', () => {
  describe('validateCreateFlightIdAndGetAeroplane', () => {
    it('should throw an error if departure and arrival airport are the same', async () => {
      const airportIdFrom = '1';
      const airportIdTo = '1';

      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(
          airportIdFrom,
          airportIdTo
        )
      ).rejects.toThrowError();

      expect(mockHttpError).toHaveBeenCalledWith(
        'Departure and arrival airport cannot be the same',
        400
      );
    });

    it('should throw an error if airport not found', async () => {
      const airportIdFrom = '1';
      const airportIdTo = '2';

      mockGetAirportById.mockResolvedValueOnce(null);

      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(
          airportIdFrom,
          airportIdTo
        )
      ).rejects.toThrowError();

      expect(mockHttpError).toHaveBeenCalledWith('Airport not found', 404);
    });

    it('should throw an error if airline not found', async () => {
      const airportIdFrom = '1';
      const airportIdTo = '2';
      const airlineId = '1';

      mockGetAirportById.mockResolvedValueOnce({ id: airportIdFrom });
      mockGetAirportById.mockResolvedValueOnce({ id: airportIdTo });
      mockGetAirlineById.mockResolvedValueOnce(null);

      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(
          airportIdFrom,
          airportIdTo,
          airlineId
        )
      ).rejects.toThrowError();

      expect(mockHttpError).toHaveBeenCalledWith('Airline not found', 404);
    });

    it('should pass validation when all inputs are valid', async () => {
      const airportIdFrom = '1';
      const airportIdTo = '2';
      const airlineId = '1';

      mockGetAirportById.mockResolvedValueOnce({ id: airportIdFrom });
      mockGetAirportById.mockResolvedValueOnce({ id: airportIdTo });
      mockGetAirlineById.mockResolvedValueOnce({ id: airlineId });

      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(
          airportIdFrom,
          airportIdTo,
          airlineId
        )
      ).resolves.not.toThrowError();
    });
  });

  describe('createFlightAndSeat', () => {
    it('should create a flight with seats', async () => {
      const payload = {
        departureDate: '2022-01-01',
        departureTime: '10:00',
        arrivalDate: '2022-01-02',
        duration: 2,
        arrivalTime: '12:00',
        price: 100,
        class: 'Economy',
        description: 'Flight description',
        airlineId: '1',
        airportIdFrom: '1',
        airportIdTo: '2',
        aeroplaneId: 'a1'
      };

      const aeroplane = {
        maxRow: 10,
        maxColumn: 6,
        id: 'a1'
      };

      const mockSeats = Array(60)
        .fill()
        .map((_, index) => ({
          row: Math.floor(index / 6) + 1,
          column: (index % 6) + 1,
          status: 'AVAILABLE',
          aeroplaneId: 'a1'
        }));

      const mockFlight = {
        id: 'f1',
        departure: 'City A',
        arrival: 'City B',
        airlineId: '1'
      };

      mockGenerateSeats.mockReturnValue(mockSeats);
      mockCreateFlightAndSeat.mockResolvedValue(mockFlight);

      const result = await flightService.createFlightAndSeat(
        payload,
        aeroplane
      );

      expect(mockGenerateSeats).toHaveBeenCalledWith(
        aeroplane.maxRow,
        aeroplane.maxColumn,
        aeroplane.id
      );

      expect(mockCreateFlightAndSeat).toHaveBeenCalledWith({
        ...payload,
        seats: mockSeats
      });

      expect(result).toEqual(mockFlight);
    });
  });

  describe('getAllFlight', () => {
    it('should return an object with meta and flight properties', async () => {
      const filter = { cursorId: null, departure: 'City A' };
      const sort = { departure: 'asc' };
      const mockFlights = [
        { id: 1, departure: 'City A', arrival: 'City B' },
        { id: 2, departure: 'City C', arrival: 'City D' }
      ];

      mockGetAllFlights.mockResolvedValueOnce(mockFlights);

      const result = await flightService.getAllFlight(filter, sort);

      expect(mockGetAllFlights).toHaveBeenCalledWith(null, {
        departure: 'City A'
      });
      expect(result.flight).toEqual(mockFlights);
      expect(result.meta.cursorId).toBe(2);
    });
  });

  describe('getDetailFlightById', () => {
    it('should return flight details by id', async () => {
      const flightId = '1';
      const mockFlight = { id: '1', departure: 'City A', arrival: 'City B' };

      mockGetDetailFlightById.mockResolvedValueOnce(mockFlight);

      const result = await flightService.getDetailFlightById(flightId);

      expect(mockGetDetailFlightById).toHaveBeenCalledWith(flightId);
      expect(result).toEqual(mockFlight);
    });
  });

  describe('getFlightWithSeatsById', () => {
    it('should return flight with seats by id', async () => {
      const flightId = '1';
      const mockFlight = { id: '1', departure: 'City A', arrival: 'City B' };
      const mockSeats = [{ row: 1, column: 1, status: 'AVAILABLE' }];

      mockGetFlightWithSeatsById.mockResolvedValueOnce({
        flight: mockFlight,
        seats: mockSeats
      });

      const result = await flightService.getFlightWithSeatsById(flightId);

      expect(mockGetFlightWithSeatsById).toHaveBeenCalledWith(flightId);
      expect(result).toEqual({ flight: mockFlight, seats: mockSeats });
    });
  });

  describe('getFlightById', () => {
    it('should return flight by id', async () => {
      const flightId = '1';
      const mockFlight = { id: '1', departure: 'City A', arrival: 'City B' };

      mockGetFlightById.mockResolvedValueOnce(mockFlight);

      const result = await flightService.getFlightById(flightId);

      expect(mockGetFlightById).toHaveBeenCalledWith(flightId);
      expect(result).toEqual(mockFlight);
    });
  });
});
