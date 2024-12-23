import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    flight: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const flightRepository = await import('../flight.js');

describe('Flight Repository', () => {
  const mockFlight = {
    id: 1,
    departureDate: '2024-12-23T15:05:40.569Z',
    departureTime: '10:00',
    arrivalDate: '2024-12-23T15:05:40.569Z',
    arrivalTime: '12:00',
    duration: 120,
    price: 100,
    class: 'Economy',
    description: 'Test flight',
    airlineId: 1,
    airportIdFrom: 1,
    airportIdTo: 2,
    aeroplaneId: 1,
    seat: [{ id: 1, status: 'AVAILABLE' }]
  };

  const mockQuery = { where: { id: 1 } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a flight and seats', async () => {
    prisma.flight.create.mockResolvedValue(mockFlight);

    const result = await flightRepository.createFlightAndSeat(mockFlight);

    expect(prisma.flight.create).toHaveBeenCalledWith({
      data: {
        departureDate: new Date(mockFlight.departureDate),
        departureTime: mockFlight.departureTime,
        arrivalDate: new Date(mockFlight.arrivalDate),
        arrivalTime: mockFlight.arrivalTime,
        duration: mockFlight.duration,
        price: mockFlight.price,
        class: mockFlight.class,
        description: mockFlight.description,
        airlineId: mockFlight.airlineId,
        airportIdFrom: mockFlight.airportIdFrom,
        airportIdTo: mockFlight.airportIdTo,
        aeroplaneId: mockFlight.aeroplaneId,
        seat: {
          createMany: {
            data: undefined
          }
        }
      }
    });
    expect(result).toEqual(mockFlight);
  });

  it('should count flight data with filter', async () => {
    prisma.flight.count.mockResolvedValue(1);

    const result = await flightRepository.countFlightDataWithFilter(mockQuery);

    expect(prisma.flight.count).toHaveBeenCalledWith(mockQuery);
    expect(result).toBe(1);
  });

  it('should get all flights', async () => {
    prisma.flight.findMany.mockResolvedValue([mockFlight]);

    const result = await flightRepository.getAllFlight(mockQuery);

    expect(prisma.flight.findMany).toHaveBeenCalledWith(mockQuery);
    expect(result).toEqual([mockFlight]);
  });

  it('should get flight details by id', async () => {
    prisma.flight.findUnique.mockResolvedValue(mockFlight);

    const result = await flightRepository.getDetailFlightById(1);

    expect(prisma.flight.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        _count: {
          select: {
            seat: {
              where: {
                status: 'AVAILABLE'
              }
            }
          }
        },
        seat: true,
        airportFrom: true,
        airportTo: true,
        airline: true,
        aeroplane: true
      }
    });
    expect(result).toEqual(mockFlight);
  });

  it('should get flight with seats by id', async () => {
    prisma.flight.findUnique.mockResolvedValue(mockFlight);

    const result = await flightRepository.getFlightWithSeatsById(1);

    expect(prisma.flight.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { seat: true }
    });
    expect(result).toEqual(mockFlight);
  });

  it('should get flight by id', async () => {
    prisma.flight.findUnique.mockResolvedValue(mockFlight);

    const result = await flightRepository.getFlightById(1);

    expect(prisma.flight.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockFlight);
  });
});
