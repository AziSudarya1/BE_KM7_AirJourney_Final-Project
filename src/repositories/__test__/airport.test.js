import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    airport: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const airportRepository = await import('../airport.js');

describe('Airport Repository', () => {
  const mockAirport = {
    id: 1,
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    continent: 'North America',
    city: 'New York',
    country: 'USA'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an airport', async () => {
    prisma.airport.create.mockResolvedValue(mockAirport);
    const result = await airportRepository.createAirport(mockAirport);
    expect(result).toEqual(mockAirport);
    expect(prisma.airport.create).toHaveBeenCalledWith({
      data: {
        code: mockAirport.code,
        name: mockAirport.name,
        continent: mockAirport.continent,
        city: mockAirport.city,
        country: mockAirport.country
      }
    });
  });

  it('should get an airport by id', async () => {
    prisma.airport.findUnique.mockResolvedValue(mockAirport);
    const result = await airportRepository.getAirportById(mockAirport.id);
    expect(result).toEqual(mockAirport);
    expect(prisma.airport.findUnique).toHaveBeenCalledWith({
      where: { id: mockAirport.id }
    });
  });

  it('should get an airport by name', async () => {
    prisma.airport.findUnique.mockResolvedValue(mockAirport);
    const result = await airportRepository.getAirportByName(mockAirport.name);
    expect(result).toEqual(mockAirport);
    expect(prisma.airport.findUnique).toHaveBeenCalledWith({
      where: { name: mockAirport.name }
    });
  });

  it('should get an airport by code', async () => {
    prisma.airport.findUnique.mockResolvedValue(mockAirport);
    const result = await airportRepository.getAirportByCode(mockAirport.code);
    expect(result).toEqual(mockAirport);
    expect(prisma.airport.findUnique).toHaveBeenCalledWith({
      where: { code: mockAirport.code }
    });
  });

  it('should update an airport', async () => {
    const updatedAirport = { ...mockAirport, name: 'Updated Airport' };
    prisma.airport.update.mockResolvedValue(updatedAirport);
    const result = await airportRepository.updateAirport(mockAirport.id, {
      name: 'Updated Airport'
    });
    expect(result).toEqual(updatedAirport);
    expect(prisma.airport.update).toHaveBeenCalledWith({
      where: { id: mockAirport.id },
      data: { name: 'Updated Airport' }
    });
  });

  it('should delete an airport', async () => {
    prisma.airport.delete.mockResolvedValue(mockAirport);
    const result = await airportRepository.deleteAirport(mockAirport.id);
    expect(result).toEqual(mockAirport);
    expect(prisma.airport.delete).toHaveBeenCalledWith({
      where: { id: mockAirport.id }
    });
  });

  it('should get all airports', async () => {
    const airports = [mockAirport];
    prisma.airport.findMany.mockResolvedValue(airports);
    const result = await airportRepository.getAllAirports();
    expect(result).toEqual(airports);
    expect(prisma.airport.findMany).toHaveBeenCalled();
  });
});
