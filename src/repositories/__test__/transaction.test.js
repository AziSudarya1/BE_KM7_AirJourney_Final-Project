import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    transaction: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const transactionRepository = await import('../transaction.js');

describe('Transaction Repository', () => {
  const mockTransaction = {
    id: 1,
    amount: 100,
    userId: 1,
    departureFlightId: 1,
    returnFlightId: 2,
    passenger: [{ departureSeatId: 1, returnSeatId: 2 }],
    payment: { status: 'PENDING', expiredAt: new Date(Date.now() + 10000) },
    user: { id: 1, name: 'John Doe' },
    departureFlight: {
      id: 1,
      airportFrom: {},
      airportTo: {},
      airline: {},
      aeroplane: {}
    },
    returnFlight: {
      id: 2,
      airportFrom: {},
      airportTo: {},
      airline: {},
      aeroplane: {}
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction and passenger with returnFlightId', async () => {
    const payload = {
      amount: 100,
      userId: 1,
      departureFlightId: 1,
      returnFlightId: 2,
      proccessedPassengers: [{ departureSeatId: 1, returnSeatId: 2 }]
    };
    const tx = {
      transaction: { create: jest.fn().mockResolvedValue(mockTransaction) }
    };

    const result = await transactionRepository.createTransactionAndPassenger(
      payload,
      tx
    );

    expect(tx.transaction.create).toHaveBeenCalledWith({
      data: {
        amount: payload.amount,
        userId: payload.userId,
        departureFlightId: payload.departureFlightId,
        returnFlightId: payload.returnFlightId,
        passenger: {
          createMany: {
            data: payload.proccessedPassengers
          }
        }
      },
      include: {
        user: true
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should create a transaction and passenger without returnFlightId', async () => {
    const payload = {
      amount: 100,
      userId: 1,
      departureFlightId: 1,
      proccessedPassengers: [{ departureSeatId: 1, returnSeatId: 2 }]
    };
    const tx = {
      transaction: { create: jest.fn().mockResolvedValue(mockTransaction) }
    };

    const result = await transactionRepository.createTransactionAndPassenger(
      payload,
      tx
    );

    expect(tx.transaction.create).toHaveBeenCalledWith({
      data: {
        amount: payload.amount,
        userId: payload.userId,
        departureFlightId: payload.departureFlightId,
        returnFlightId: null,
        passenger: {
          createMany: {
            data: payload.proccessedPassengers
          }
        }
      },
      include: {
        user: true
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get active transaction', async () => {
    prisma.transaction.findFirst.mockResolvedValue(mockTransaction);

    const result = await transactionRepository.getActiveTransaction(1);

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 1,
        payment: {
          status: {
            notIn: ['CANCELLED', 'SUCCESS']
          },
          expiredAt: {
            gt: expect.any(Date)
          }
        }
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get transaction with user and passenger by id', async () => {
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result =
      await transactionRepository.getTransactionWithUserAndPassengerById(1);

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1
      },
      include: {
        user: true,
        passenger: {
          select: {
            departureSeatId: true,
            returnSeatId: true
          }
        }
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get transaction with user and payment by id', async () => {
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result =
      await transactionRepository.getTransactionWithUserAndPaymentById(1);

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1
      },
      include: {
        payment: true,
        user: true
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get transaction with passenger and payment by id', async () => {
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result =
      await transactionRepository.getTransactionWithPassengerAndPaymentById(1);

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1
      },
      include: {
        passenger: {
          select: {
            departureSeatId: true,
            returnSeatId: true
          }
        },
        payment: true
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get detail transaction by id', async () => {
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result = await transactionRepository.getDetailTransactionById(1);

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1
      },
      include: {
        user: true,
        passenger: true,
        payment: true,
        departureFlight: {
          include: {
            airportFrom: true,
            airportTo: true,
            airline: true,
            aeroplane: true
          }
        },
        returnFlight: {
          include: {
            airportFrom: true,
            airportTo: true,
            airline: true,
            aeroplane: true
          }
        }
      }
    });
    expect(result).toEqual(mockTransaction);
  });

  it('should get all transactions', async () => {
    const query = { where: { userId: 1 } };
    prisma.transaction.findMany.mockResolvedValue([mockTransaction]);

    const result = await transactionRepository.getAllTransactions(query);

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(query);
    expect(result).toEqual([mockTransaction]);
  });

  it('should count transaction data with filter', async () => {
    const filter = { userId: 1 };
    prisma.transaction.count.mockResolvedValue(1);

    const result =
      await transactionRepository.countTransactionDataWithFilter(filter);

    expect(prisma.transaction.count).toHaveBeenCalledWith({
      where: filter
    });
    expect(result).toEqual(1);
  });
});
