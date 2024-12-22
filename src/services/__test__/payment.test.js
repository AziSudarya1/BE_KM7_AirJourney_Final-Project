import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

const mockMidtransTransaction = jest.fn();

jest.unstable_mockModule('../../utils/midtrans.js', () => ({
  midtrans: {
    createTransaction: mockMidtransTransaction
  }
}));

const mockGetTransactionWithPassengerById = jest.fn();

jest.unstable_mockModule('../../repositories/transaction.js', () => ({
  getTransactionWithPassengerById: mockGetTransactionWithPassengerById
}));

const mockUpdateSeatStatusBySeats = jest.fn();

jest.unstable_mockModule('../../repositories/seat.js', () => ({
  updateSeatStatusBySeats: mockUpdateSeatStatusBySeats
}));

const updatePaymentStatusAndMethod = jest.fn();

jest.unstable_mockModule('../../repositories/payment.js', () => ({
  updatePaymentStatusAndMethod: updatePaymentStatusAndMethod
}));

const mockPrismaTransaction = jest.fn();
jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    $transaction: mockPrismaTransaction
  }
}));

const mockCreateUserNotification = jest.fn();
jest.unstable_mockModule('../notification.js', () => ({
  createUserNotification: mockCreateUserNotification
}));

const mockTx = {
  commit: jest.fn(),
  rollback: jest.fn()
};

const paymentServices = await import('../payment.js');

describe('createMidtransToken', () => {
  it('should throw an error if transaction is not provided', async () => {
    await expect(
      paymentServices.createMidtransToken(null)
    ).rejects.toThrowError(new HttpError('Transaction not found', 404));
  });

  it('should create a midtrans token successfully', async () => {
    const mockTransaction = {
      id: '123',
      amount: 1000,
      user: {
        email: 'test@example.com'
      }
    };

    const mockResponse = { token: 'mockToken' };
    mockMidtransTransaction.mockResolvedValue(mockResponse);

    const result = await paymentServices.createMidtransToken(mockTransaction);

    expect(result).toEqual(mockResponse);
    expect(mockMidtransTransaction).toHaveBeenCalledWith({
      transaction_details: {
        order_id: mockTransaction.id,
        gross_amount: mockTransaction.amount
      },
      customer_details: {
        email: mockTransaction.user.email
      }
    });
  });
});

describe('updateTransactionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if transaction is not found', async () => {
    mockGetTransactionWithPassengerById.mockResolvedValue(null);

    await expect(
      paymentServices.updateTransactionStatus(
        '123',
        'settlement',
        'credit_card'
      )
    ).rejects.toThrowError(new HttpError('Transaction not found', 404));
  });

  it('should update transaction status to SUCCESS and book seats on settlement', async () => {
    const mockTransaction = {
      id: '123',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'settlement',
      'credit_card'
    );

    expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
      ['seat1', 'seat2', 'seat3'],
      'BOOKED',
      mockTx
    );
    expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
      '123',
      { status: 'SUCCESS', method: 'credit_card' },
      mockTx
    );
  });

  it('should update transaction status to CANCELLED and make seats available on cancel', async () => {
    const mockTransaction = {
      id: '123',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'cancel',
      'credit_card'
    );

    expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
      ['seat1', 'seat2', 'seat3'],
      'AVAILABLE',
      mockTx
    );
    expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
      '123',
      { status: 'CANCELLED', method: 'credit_card' },
      mockTx
    );
  });

  it('should update transaction status to PENDING on pending', async () => {
    const mockTransaction = {
      id: '123',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'pending',
      'credit_card'
    );

    expect(mockUpdateSeatStatusBySeats).not.toHaveBeenCalled();
    expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
      '123',
      { status: 'PENDING', method: 'credit_card' },
      mockTx
    );
  });

  it('should handle unknown status gracefully', async () => {
    const mockTransaction = {
      id: '123',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'unknown_status',
      'credit_card'
    );

    expect(mockUpdateSeatStatusBySeats).not.toHaveBeenCalled();
    expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
      '123',
      { status: undefined, method: 'credit_card' },
      mockTx
    );
  });

  it('should create a user notification on successful booking', async () => {
    const mockTransaction = {
      id: '123',
      userId: 'user1',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'settlement',
      'credit_card'
    );

    expect(mockCreateUserNotification).toHaveBeenCalledWith(
      'user1',
      {
        title: 'Ticket Booking Success',
        message: 'Your ticket has been successfully booked'
      },
      mockTx
    );
  });

  it('should create a user notification on booking cancellation', async () => {
    const mockTransaction = {
      id: '123',
      userId: 'user1',
      passenger: [
        { departureSeatId: 'seat1', returnSeatId: 'seat2' },
        { departureSeatId: 'seat3', returnSeatId: null }
      ]
    };

    mockGetTransactionWithPassengerById.mockResolvedValue(mockTransaction);
    mockPrismaTransaction.mockImplementation(async (callback) => {
      await callback(mockTx);
    });

    await paymentServices.updateTransactionStatus(
      '123',
      'cancel',
      'credit_card'
    );

    expect(mockCreateUserNotification).toHaveBeenCalledWith(
      'user1',
      {
        title: 'Ticket Booking Canceled',
        message: 'Your ticket has been canceled'
      },
      mockTx
    );
  });
});
