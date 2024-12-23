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
      DATABASE_URL: 'postgresql://user:password@localhost:5432/testdb'
    }
  };
});

const { PrismaClient } = await import('@prisma/client');
const { appEnv } = await import('../env.js');
const { prisma } = await import('../db.js');

describe('Database Utility', () => {
  it('should initialize PrismaClient with the correct datasource URL', () => {
    expect(PrismaClient).toHaveBeenCalledWith({
      datasourceUrl: appEnv.DATABASE_URL
    });
  });

  it('should connect and disconnect properly', async () => {
    await prisma.$connect();
    expect(prisma.$connect).toHaveBeenCalled();

    await prisma.$disconnect();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
