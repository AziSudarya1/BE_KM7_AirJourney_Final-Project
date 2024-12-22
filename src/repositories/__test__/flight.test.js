import { describe, expect, it, jest } from '@jest/globals';

const mockCreateFlightAndSeat = jest.fn();
const mockGetAllFlight = jest.fn();
const mockGetDetailFlightById = jest.fn();
const mockGetFlightWithSeatsById = jest.fn();
const mockGetFlightById = jest.fn();

jest.unstable_mockModule('../../repositories/flight.js', () => ({
  createFlightAndSeat: mockCreateFlightAndSeat,
  getAllFlight: mockGetAllFlight,
  getDetailFlightById: mockGetDetailFlightById,
  getFlightWithSeatsById: mockGetFlightWithSeatsById,
  getFlightById: mockGetFlightById
}));

const flightRepository = await import('../../repositories/flight.js');

describe('Flight Repository', () => {
  describe('createFlightAndSeat', () => {
    it('should create a new flight with seats', async () => {
      const mockPayload = {
        departureDate: '2024-12-25',
        departureTime: '10:00',
        arrivalDate: '2024-12-25',
        arrivalTime: '12:00',
        duration: 120,
        price: 500000,
        class: 'ECONOMY',
        description: 'Test flight',
        airlineId: 'airline-123',
        airportIdFrom: 'airport-1',
        airportIdTo: 'airport-2',
        aeroplaneId: 'aeroplane-1',
        seats: [
          { row: 1, column: 1, status: 'AVAILABLE' },
          { row: 1, column: 2, status: 'AVAILABLE' }
        ]
      };

      mockCreateFlightAndSeat.mockResolvedValue(mockPayload);

      const result = await flightRepository.createFlightAndSeat(mockPayload);

      expect(mockCreateFlightAndSeat).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('getAllFlight', () => {
    it('should return a list of flights', async () => {
      const mockFlights = [
        {
          id: 'flight-1',
          departureDate: '2024-12-25',
          departureTime: '10:00',
          arrivalDate: '2024-12-25',
          arrivalTime: '12:00',
          duration: 120,
          price: 500000
        },
        {
          id: 'flight-2',
          departureDate: '2024-12-26',
          departureTime: '14:00',
          arrivalDate: '2024-12-26',
          arrivalTime: '16:00',
          duration: 120,
          price: 600000
        }
      ];

      mockGetAllFlight.mockResolvedValue(mockFlights);

      const result = await flightRepository.getAllFlight(null, {});

      expect(mockGetAllFlight).toHaveBeenCalledWith(null, {});
      expect(result).toEqual(mockFlights);
    });
  });

  describe('getDetailFlightById', () => {
    it('should return flight details by id', async () => {
      const mockId = 'flight-1';
      const mockFlightDetails = {
        id: 'flight-1',
        departureDate: '2024-12-25',
        departureTime: '10:00',
        arrivalDate: '2024-12-25',
        arrivalTime: '12:00',
        duration: 120,
        price: 500000,
        seats: [{ row: 1, column: 1, status: 'AVAILABLE' }]
      };

      mockGetDetailFlightById.mockResolvedValue(mockFlightDetails);

      const result = await flightRepository.getDetailFlightById(mockId);

      expect(mockGetDetailFlightById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockFlightDetails);
    });
  });

  describe('getFlightWithSeatsById', () => {
    it('should return flight with seats by id', async () => {
      const mockId = 'flight-1';
      const mockFlightWithSeats = {
        id: 'flight-1',
        seats: [{ row: 1, column: 1, status: 'AVAILABLE' }]
      };

      mockGetFlightWithSeatsById.mockResolvedValue(mockFlightWithSeats);

      const result = await flightRepository.getFlightWithSeatsById(mockId);

      expect(mockGetFlightWithSeatsById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockFlightWithSeats);
    });
  });

  describe('getFlightById', () => {
    it('should return flight by id', async () => {
      const mockId = 'flight-1';
      const mockFlight = {
        id: 'flight-1',
        departureDate: '2024-12-25',
        departureTime: '10:00'
      };

      mockGetFlightById.mockResolvedValue(mockFlight);

      const result = await flightRepository.getFlightById(mockId);

      expect(mockGetFlightById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockFlight);
    });
  });
});
