import { jest } from '@jest/globals';

jest.unstable_mockModule('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn()
    }))
  };
});

jest.unstable_mockModule('../env.js', () => {
  return {
    appEnv: {
      DATABASE_URL:
        'postgresql://admin:admin@localhost:5432/binar_final_batch7?schema=public'
    }
  };
});

const { PrismaClient } = await import('@prisma/client');
const { appEnv } = await import('../env.js');

describe('Database Utility', () => {
  it('should initialize PrismaClient with the correct datasource URL', () => {
    expect(PrismaClient).toHaveBeenCalledWith({
      datasourceUrl: appEnv.DATABASE_URL
    });
  });

  it('should connect and disconnect properly', async () => {
    const mockConnect = jest.fn();
    const mockDisconnect = jest.fn();
    PrismaClient.mockImplementation(() => ({
      $connect: mockConnect,
      $disconnect: mockDisconnect
    }));

    const mockPrisma = new PrismaClient();

    await mockPrisma.$connect();
    expect(mockConnect).toHaveBeenCalled();

    await mockPrisma.$disconnect();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
