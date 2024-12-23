import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../utils/error.js';

const mockMidtransTransaction = jest.fn();

jest.unstable_mockModule('../../utils/midtrans.js', () => ({
  midtrans: {
    createTransaction: mockMidtransTransaction
  }
}));

const mockGetTransactionWithPassengerAndPaymentById = jest.fn();

jest.unstable_mockModule('../../repositories/transaction.js', () => ({
  getTransactionWithPassengerAndPaymentById:
    mockGetTransactionWithPassengerAndPaymentById
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

beforeEach(() => {
  jest.clearAllMocks();
});

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

  describe('updateTransactionStatus', () => {
    it('should throw an error if transaction is not found', async () => {
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(null);

      await expect(
        paymentServices.updateTransactionStatus(
          'invalidId',
          'settlement',
          'credit_card'
        )
      ).rejects.toThrowError(new HttpError('Transaction not found', 404));
    });

    it('should throw an error if transaction has expired', async () => {
      const mockTransaction = {
        payment: {
          expiredAt: new Date(Date.now() - 1000),
          status: 'PENDING'
        }
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );

      await expect(
        paymentServices.updateTransactionStatus(
          '123',
          'settlement',
          'credit_card'
        )
      ).rejects.toThrowError(new HttpError('Transaction has expired', 400));
    });

    it('should throw an error if transaction is already processed', async () => {
      const mockTransaction = {
        payment: {
          expiredAt: new Date(Date.now() + 1000),
          status: 'SUCCESS'
        }
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );

      await expect(
        paymentServices.updateTransactionStatus(
          '123',
          'settlement',
          'credit_card'
        )
      ).rejects.toThrowError(
        new HttpError('Transaction already processed', 400)
      );
    });

    it('should update seat status and create notification for successful transaction', async () => {
      const mockTransaction = {
        id: '123',
        payment: {
          expiredAt: new Date(Date.now() + 1000),
          status: 'PENDING'
        },
        passenger: [{ departureSeatId: 'seat1', returnSeatId: 'seat2' }],
        userId: 'user123'
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );
      mockPrismaTransaction.mockImplementation(async (callback) => {
        await callback(mockTx);
        mockTx.commit();
      });

      await paymentServices.updateTransactionStatus(
        '123',
        'settlement',
        'credit_card'
      );

      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        ['seat1', 'seat2'],
        'BOOKED',
        mockTx
      );
      expect(mockCreateUserNotification).toHaveBeenCalledWith(
        'user123',
        {
          title: 'Ticket Booking Success',
          message: 'Your ticket has been successfully booked'
        },
        mockTx
      );
      expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
        '123',
        {
          status: 'SUCCESS',
          method: 'credit_card'
        },
        mockTx
      );
      expect(mockTx.commit).toHaveBeenCalled();
    });

    it('should update seat status and create notification for canceled transaction', async () => {
      const mockTransaction = {
        id: '123',
        payment: {
          expiredAt: new Date(Date.now() + 1000),
          status: 'PENDING'
        },
        passenger: [{ departureSeatId: 'seat1', returnSeatId: 'seat2' }],
        userId: 'user123'
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );
      mockPrismaTransaction.mockImplementation(async (callback) => {
        if (callback.name === 'unknown_status') {
          return;
        }
        await callback(mockTx);
        if (callback.name !== 'unknown_status') {
          mockTx.commit();
        }
      });

      await paymentServices.updateTransactionStatus(
        '123',
        'cancel',
        'credit_card'
      );

      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        ['seat1', 'seat2'],
        'AVAILABLE',
        mockTx
      );
      expect(mockCreateUserNotification).toHaveBeenCalledWith(
        'user123',
        {
          title: 'Ticket Booking Canceled',
          message: 'Your ticket has been canceled'
        },
        mockTx
      );
      expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
        '123',
        {
          status: 'CANCELLED',
          method: 'credit_card'
        },
        mockTx
      );
      expect(mockTx.commit).toHaveBeenCalled();
    });

    it('should update payment status to pending', async () => {
      const mockTransaction = {
        id: '123',
        payment: {
          expiredAt: new Date(Date.now() + 1000),
          status: 'PENDING'
        },
        passenger: []
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );
      mockPrismaTransaction.mockImplementation(async (callback) => {
        if (callback.name !== 'unknown_status') {
          await callback(mockTx);
          mockTx.commit();
        }
      });

      await paymentServices.updateTransactionStatus(
        '123',
        'pending',
        'credit_card'
      );

      expect(updatePaymentStatusAndMethod).toHaveBeenCalledWith(
        '123',
        {
          status: 'PENDING',
          method: 'credit_card'
        },
        mockTx
      );
      expect(mockTx.commit).toHaveBeenCalled();
    });

    it('should handle unknown status gracefully', async () => {
      const mockTransaction = {
        id: '123',
        payment: {
          expiredAt: new Date(Date.now() + 1000),
          status: 'PENDING'
        },
        passenger: []
      };
      mockGetTransactionWithPassengerAndPaymentById.mockResolvedValue(
        mockTransaction
      );
      mockPrismaTransaction.mockImplementation(async (callback) => {
        if (callback.name === 'unknown_status') {
          return;
        }
        await callback(mockTx);
        if (callback.name !== 'unknown_status') {
          mockTx.commit();
        }
      });

      await paymentServices.updateTransactionStatus(
        '123',
        'unknown_status',
        'credit_card'
      );

      expect(updatePaymentStatusAndMethod).not.toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ status: expect.any(String) }),
        mockTx
      );
    });
  });
});
