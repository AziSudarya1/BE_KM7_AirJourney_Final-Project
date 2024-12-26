import { jest } from '@jest/globals';

jest.unstable_mockModule('@prisma/client', () => {
  const mockPrismaClient = jest.fn();
  const mockInstance = {
    $connect: jest.fn().mockResolvedValue(),
    $disconnect: jest.fn().mockResolvedValue()
  };

  mockPrismaClient.mockImplementation(() => mockInstance);

  return {
    PrismaClient: mockPrismaClient
  };
});

jest.unstable_mockModule('../env.js', () => ({
  appEnv: {
    DATABASE_URL: 'postgresql://user:password@localhost:5432/testdb'
  }
}));

const { PrismaClient } = await import('@prisma/client');
const { prisma } = await import('../db.js');

describe('Database Utility', () => {
  it('should initialize PrismaClient with the correct datasource URL', () => {
    const _client = new PrismaClient();

    expect(PrismaClient).toHaveBeenCalledTimes(1);

    expect(PrismaClient).toHaveBeenCalledWith();
  });

  it('should connect and disconnect properly', async () => {
    await prisma.$connect();
    expect(prisma.$connect).toHaveBeenCalled();

    await prisma.$disconnect();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
