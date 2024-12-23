import { describe, expect, it, jest } from '@jest/globals';

// Mock Prisma Client secara langsung
jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    aeroplane: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

// Import ulang dependensi setelah mocking
const { prisma } = await import('../../utils/db.js');
const aeroplaneRepository = await import('../aeroplane.js');

describe('Aeroplane Repository', () => {
  const mockAeroplane = {
    id: 1,
    name: 'Boeing 737',
    code: 'B737',
    type: 'Commercial',
    maxRow: 30,
    maxColumn: 6
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createAeroplane should create a new aeroplane', async () => {
    prisma.aeroplane.create.mockResolvedValue(mockAeroplane);
    const result = await aeroplaneRepository.createAeroplane(mockAeroplane);
    expect(result).toEqual(mockAeroplane);
    expect(prisma.aeroplane.create).toHaveBeenCalledWith({
      data: {
        name: mockAeroplane.name,
        code: mockAeroplane.code,
        type: mockAeroplane.type,
        maxRow: mockAeroplane.maxRow,
        maxColumn: mockAeroplane.maxColumn
      }
    });
  });

  it('getAeroplaneById should return an aeroplane by id', async () => {
    prisma.aeroplane.findUnique.mockResolvedValue(mockAeroplane);
    const result = await aeroplaneRepository.getAeroplaneById(1);
    expect(result).toEqual(mockAeroplane);
    expect(prisma.aeroplane.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    });
  });

  it('getAeroplaneByName should return an aeroplane by name', async () => {
    prisma.aeroplane.findUnique.mockResolvedValue(mockAeroplane);
    const result = await aeroplaneRepository.getAeroplaneByName('Boeing 737');
    expect(result).toEqual(mockAeroplane);
    expect(prisma.aeroplane.findUnique).toHaveBeenCalledWith({
      where: { name: 'Boeing 737' }
    });
  });

  it('getAeroplaneByCode should return an aeroplane by code', async () => {
    prisma.aeroplane.findUnique.mockResolvedValue(mockAeroplane);
    const result = await aeroplaneRepository.getAeroplaneByCode('B737');
    expect(result).toEqual(mockAeroplane);
    expect(prisma.aeroplane.findUnique).toHaveBeenCalledWith({
      where: { code: 'B737' }
    });
  });

  it('updateAeroplane should update an aeroplane', async () => {
    const updatedAeroplane = { ...mockAeroplane, name: 'Boeing 747' };
    prisma.aeroplane.update.mockResolvedValue(updatedAeroplane);
    const result = await aeroplaneRepository.updateAeroplane(1, {
      name: 'Boeing 747'
    });
    expect(result).toEqual(updatedAeroplane);
    expect(prisma.aeroplane.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Boeing 747' }
    });
  });

  it('deleteAeroplane should delete an aeroplane', async () => {
    prisma.aeroplane.delete.mockResolvedValue(mockAeroplane);
    const result = await aeroplaneRepository.deleteAeroplane(1);
    expect(result).toEqual(mockAeroplane);
    expect(prisma.aeroplane.delete).toHaveBeenCalledWith({
      where: { id: 1 }
    });
  });

  it('getAllAeroplanes should return all aeroplanes', async () => {
    prisma.aeroplane.findMany.mockResolvedValue([mockAeroplane]);
    const result = await aeroplaneRepository.getAllAeroplanes();
    expect(result).toEqual([mockAeroplane]);
    expect(prisma.aeroplane.findMany).toHaveBeenCalled();
  });

  it('getAeroplaneById should handle errors', async () => {
    prisma.aeroplane.findUnique.mockRejectedValue(new Error('Database error'));
    await expect(aeroplaneRepository.getAeroplaneById('1')).rejects.toThrow(
      'Database error'
    );
  });
});
