import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

// Mock repositories flight
const mockCreateFlight = jest.fn();
const mockGetAllFlights = jest.fn();
const mockGetFlightById = jest.fn();
const mockGetDetailFlightById = jest.fn();
const mockGetFlightWithSeatsById = jest.fn();
const mockCreateFlightAndSeat = jest.fn();
const mockCountFlightDataWithFilter = jest.fn();

jest.unstable_mockModule('../../repositories/flight.js', () => ({
  createFlight: mockCreateFlight,
  getAllFlight: mockGetAllFlights,
  getFlightById: mockGetFlightById,
  getDetailFlightById: mockGetDetailFlightById,
  getFlightWithSeatsById: mockGetFlightWithSeatsById,
  createFlightAndSeat: mockCreateFlightAndSeat,
  countFlightDataWithFilter: mockCountFlightDataWithFilter
}));

// Mock repository for airport
const mockGetAirportById = jest.fn();
jest.unstable_mockModule('../../repositories/airport.js', () => ({
  getAirportById: mockGetAirportById
}));

// Mock repository for airline
const mockGetAirlineById = jest.fn();
jest.unstable_mockModule('../../repositories/airline.js', () => ({
  getAirlineById: mockGetAirlineById
}));

const flightService = await import('../flight.js');
describe('Flight Service', () => {
  describe('validateCreateFlightIdAndGetAeroplane', () => {
    it('should throw an error if departure and arrival airport are the same', async () => {
      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(1, 1, 1)
      ).rejects.toThrowError(
        new HttpError('Departure and arrival airport cannot be the same', 400)
      );
    });

    it('should throw an error if airportFrom is not found', async () => {
      mockGetAirportById.mockResolvedValueOnce(null);
      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(1, 2, 1)
      ).rejects.toThrowError(new HttpError('Airport not found', 404));
    });

    it('should throw an error if airportTo is not found', async () => {
      mockGetAirportById
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null);
      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(1, 2, 1)
      ).rejects.toThrowError(new HttpError('Airport not found', 404));
    });

    it('should throw an error if airline is not found', async () => {
      mockGetAirportById
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      mockGetAirlineById.mockResolvedValueOnce(null);
      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(1, 2, 1)
      ).rejects.toThrowError(new HttpError('Airline not found', 404));
    });

    it('should pass validation if all data is valid', async () => {
      mockGetAirportById
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      mockGetAirlineById.mockResolvedValueOnce({ id: 1 });
      await expect(
        flightService.validateCreateFlightIdAndGetAeroplane(1, 2, 1)
      ).resolves.not.toThrow();
    });
  });

  describe('createFlightAndSeat', () => {
    it('should create flight and seats', async () => {
      const payload = { flightNumber: '123' };
      const aeroplane = { maxRow: 2, maxColumn: 2, id: 1 };

      mockCreateFlightAndSeat.mockResolvedValueOnce({
        id: 1,
        ...payload,
        seats: [
          { aeroplaneId: 1, column: 1, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 1, row: 2, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 2, status: 'AVAILABLE' }
        ]
      });

      const result = await flightService.createFlightAndSeat(
        payload,
        aeroplane
      );

      expect(result).toEqual({
        id: 1,
        ...payload,
        seats: [
          { aeroplaneId: 1, column: 1, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 1, row: 2, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 2, status: 'AVAILABLE' }
        ]
      });
      expect(mockCreateFlightAndSeat).toHaveBeenCalledWith({
        ...payload,
        seats: [
          { aeroplaneId: 1, column: 1, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 1, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 1, row: 2, status: 'AVAILABLE' },
          { aeroplaneId: 1, column: 2, row: 2, status: 'AVAILABLE' }
        ]
      });
    });
  });

  describe('getAllFlight', () => {
    it('should get all flights with filters, sorting, and skip', async () => {
      const filter = { airlineId: 1 };
      const sort = { departureDate: 'asc' };
      const meta = { limit: 10, skip: 10 };
      const flights = [{ id: 1, flightNumber: '123' }];
      mockGetAllFlights.mockResolvedValueOnce(flights);

      const result = await flightService.getAllFlight(filter, sort, meta);

      expect(result).toEqual(flights);
      expect(mockGetAllFlights).toHaveBeenCalledWith({
        take: 10,
        where: {
          ...filter,
          departureDate: {
            gte: expect.any(Date)
          }
        },
        orderBy: sort,
        include: {
          _count: {
            select: {
              seat: {
                where: { status: 'AVAILABLE' }
              }
            }
          },
          aeroplane: true,
          airline: true,
          airportFrom: true,
          airportTo: true
        },
        skip: 10
      });
    });
    it('should get all flights without filters and sorting', async () => {
      const meta = { limit: 10, skip: 0 };
      const flights = [{ id: 1, flightNumber: '123' }];
      mockGetAllFlights.mockResolvedValueOnce(flights);

      const result = await flightService.getAllFlight({}, {}, meta);

      expect(result).toEqual(flights);
      expect(mockGetAllFlights).toHaveBeenCalledWith({
        take: 10,
        where: {
          departureDate: {
            gte: expect.any(Date)
          }
        },
        include: {
          _count: {
            select: {
              seat: {
                where: { status: 'AVAILABLE' }
              }
            }
          },
          aeroplane: true,
          airline: true,
          airportFrom: true,
          airportTo: true
        },
        orderBy: { id: 'asc' }
      });
    });

    it('should set distinct and orderBy fields when favourite is true', async () => {
      const filter = {};
      const sort = {};
      const meta = { limit: 10, skip: 0 };
      const favourite = true;
      const flights = [{ id: 1, flightNumber: '123' }];

      mockGetAllFlights.mockResolvedValueOnce(flights);

      const result = await flightService.getAllFlight(
        filter,
        sort,
        meta,
        favourite
      );

      expect(result).toEqual(flights);
      expect(mockGetAllFlights).toHaveBeenCalledWith({
        take: 10,
        where: {
          departureDate: {
            gte: expect.any(Date)
          }
        },
        include: {
          airportFrom: true,
          airportTo: true,
          airline: true,
          aeroplane: true,
          _count: {
            select: {
              seat: {
                where: {
                  status: 'AVAILABLE'
                }
              }
            }
          }
        },
        distinct: ['airportIdFrom', 'airportIdTo'],
        orderBy: {
          departureTransaction: {
            _count: 'desc'
          }
        }
      });
    });
  });

  describe('getDetailFlightById', () => {
    it('should return flight details by id', async () => {
      const flightDetails = { id: 1, flightNumber: '123' };
      mockGetDetailFlightById.mockResolvedValueOnce(flightDetails);

      const result = await flightService.getDetailFlightById(1);

      expect(result).toEqual(flightDetails);
      expect(mockGetDetailFlightById).toHaveBeenCalledWith(1);
    });
  });

  describe('getFlightWithSeatsById', () => {
    it('should return flight with seats by id', async () => {
      const flightWithSeats = { id: 1, flightNumber: '123', seats: [] };
      mockGetFlightWithSeatsById.mockResolvedValueOnce(flightWithSeats);

      const result = await flightService.getFlightWithSeatsById(1);

      expect(result).toEqual(flightWithSeats);
      expect(mockGetFlightWithSeatsById).toHaveBeenCalledWith(1);
    });
  });

  describe('getFlightById', () => {
    it('should get flight by id', async () => {
      const flight = { id: 1, flightNumber: '123' };
      mockGetFlightById.mockResolvedValueOnce(flight);

      const result = await flightService.getFlightById(1);

      expect(result).toEqual(flight);
      expect(mockGetFlightById).toHaveBeenCalledWith(1);
    });
  });

  describe('countFlightDataWithFilterAndCreateMeta', () => {
    it('should calculate pagination metadata correctly', async () => {
      mockCountFlightDataWithFilter.mockResolvedValueOnce(25);

      const result = await flightService.countFlightDataWithFilterAndCreateMeta(
        {},
        2
      );

      expect(result).toEqual({
        page: 2,
        limit: 10,
        totalPage: 3,
        totalData: 25,
        skip: 10,
        favourite: undefined
      });
      expect(mockCountFlightDataWithFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            departureDate: expect.objectContaining({
              gte: expect.any(Date)
            })
          })
        })
      );
    });

    it('should throw an error if requested page exceeds total pages', async () => {
      mockCountFlightDataWithFilter.mockResolvedValueOnce(10);

      await expect(
        flightService.countFlightDataWithFilterAndCreateMeta({}, 5)
      ).rejects.toThrowError(new HttpError('Page not found', 404));
    });

    it('should return correct metadata when totalData is zero', async () => {
      mockCountFlightDataWithFilter.mockResolvedValueOnce(0);

      const result = await flightService.countFlightDataWithFilterAndCreateMeta(
        {},
        1
      );

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalPage: 1,
        skip: 0,
        favourite: undefined
      });
      expect(mockCountFlightDataWithFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            departureDate: expect.objectContaining({
              gte: expect.any(Date)
            })
          })
        })
      );
    });

    it('should return metadata with favourite flag', async () => {
      mockCountFlightDataWithFilter.mockClear();
      const result = await flightService.countFlightDataWithFilterAndCreateMeta(
        {},
        1,
        true
      );

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalPage: 1,
        skip: 0,
        favourite: true
      });
      expect(mockCountFlightDataWithFilter).not.toHaveBeenCalled();
    });

    it('should include filter in the query if filter is provided', async () => {
      const filter = { airlineId: 1 };
      mockCountFlightDataWithFilter.mockResolvedValueOnce(10);

      const result = await flightService.countFlightDataWithFilterAndCreateMeta(
        filter,
        1
      );

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalPage: 1,
        totalData: 10,
        skip: 0,
        favourite: undefined
      });
      expect(mockCountFlightDataWithFilter).toHaveBeenCalledWith({
        where: {
          departureDate: {
            gte: expect.any(Date)
          },
          ...filter
        }
      });
    });
  });

  describe('generateSeats', () => {
    it('should generate seats correctly', () => {
      const maxRow = 2;
      const maxColumn = 2;
      const aeroplaneId = 1;
      const expectedSeats = [
        { row: 1, column: 1, status: 'AVAILABLE', aeroplaneId },
        { row: 1, column: 2, status: 'AVAILABLE', aeroplaneId },
        { row: 2, column: 1, status: 'AVAILABLE', aeroplaneId },
        { row: 2, column: 2, status: 'AVAILABLE', aeroplaneId }
      ];

      const seats = flightService.generateSeats(maxRow, maxColumn, aeroplaneId);

      expect(seats).toEqual(expectedSeats);
    });

    it('should include flightId if provided', () => {
      const maxRow = 1;
      const maxColumn = 1;
      const aeroplaneId = 1;
      const flightId = 1;
      const expectedSeats = [
        { row: 1, column: 1, status: 'AVAILABLE', aeroplaneId, flightId }
      ];

      const seats = flightService.generateSeats(
        maxRow,
        maxColumn,
        aeroplaneId,
        flightId
      );

      expect(seats).toEqual(expectedSeats);
    });
  });
});
