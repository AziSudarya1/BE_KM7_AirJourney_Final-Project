import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    airline: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const airlineRepository = await import('../airline.js');

describe('Airline Repository', () => {
  const mockAirline = {
    id: 1,
    code: 'AA',
    name: 'American Airlines',
    image: 'image_url'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an airline', async () => {
    prisma.airline.create.mockResolvedValue(mockAirline);
    const result = await airlineRepository.createAirline(mockAirline);
    expect(result).toEqual(mockAirline);
    expect(prisma.airline.create).toHaveBeenCalledWith({
      data: {
        code: mockAirline.code,
        name: mockAirline.name,
        image: mockAirline.image
      }
    });
  });

  it('should get all airlines', async () => {
    prisma.airline.findMany.mockResolvedValue([mockAirline]);
    const result = await airlineRepository.getAllAirlines();
    expect(result).toEqual([mockAirline]);
    expect(prisma.airline.findMany).toHaveBeenCalled();
  });

  it('should update an airline', async () => {
    const updatedAirline = { ...mockAirline, name: 'Updated Airline' };
    prisma.airline.update.mockResolvedValue(updatedAirline);
    const result = await airlineRepository.updateAirline(mockAirline.id, {
      name: 'Updated Airline'
    });
    expect(result).toEqual(updatedAirline);
    expect(prisma.airline.update).toHaveBeenCalledWith({
      where: { id: mockAirline.id },
      data: { name: 'Updated Airline' }
    });
  });

  it('should get an airline by id', async () => {
    prisma.airline.findUnique.mockResolvedValue(mockAirline);
    const result = await airlineRepository.getAirlineById(mockAirline.id);
    expect(result).toEqual(mockAirline);
    expect(prisma.airline.findUnique).toHaveBeenCalledWith({
      where: { id: mockAirline.id }
    });
  });

  it('should get an airline by name', async () => {
    prisma.airline.findFirst.mockResolvedValue(mockAirline);
    const result = await airlineRepository.getAirlineByName(mockAirline.name);
    expect(result).toEqual(mockAirline);
    expect(prisma.airline.findFirst).toHaveBeenCalledWith({
      where: { name: mockAirline.name }
    });
  });

  it('should get an airline by code', async () => {
    prisma.airline.findUnique.mockResolvedValue(mockAirline);
    const result = await airlineRepository.getAirlineByCode(mockAirline.code);
    expect(result).toEqual(mockAirline);
    expect(prisma.airline.findUnique).toHaveBeenCalledWith({
      where: { code: mockAirline.code }
    });
  });

  it('should delete an airline', async () => {
    prisma.airline.delete.mockResolvedValue(mockAirline);
    const result = await airlineRepository.deleteAirline(mockAirline.id);
    expect(result).toEqual(mockAirline);
    expect(prisma.airline.delete).toHaveBeenCalledWith({
      where: { id: mockAirline.id }
    });
  });
});
