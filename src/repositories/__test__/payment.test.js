import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    payment: {
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const paymentRepository = await import('../payment.js');

describe('Payment Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePaymentStatusAndMethod', () => {
    it('should update payment status and method using default prisma', async () => {
      const transactionId = '123';
      const payload = { status: 'SUCCESS', method: 'credit_card' };

      await paymentRepository.updatePaymentStatusAndMethod(
        transactionId,
        payload
      );

      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { transactionId },
        data: { ...payload }
      });
    });

    it('should update payment status and method using a provided transaction instance', async () => {
      const transactionId = '456';
      const payload = { status: 'PENDING', method: 'paypal' };
      const mockTx = {
        payment: {
          update: jest.fn()
        }
      };

      await paymentRepository.updatePaymentStatusAndMethod(
        transactionId,
        payload,
        mockTx
      );

      expect(mockTx.payment.update).toHaveBeenCalledWith({
        where: { transactionId },
        data: { ...payload }
      });
    });
  });

  describe('cancelAllPaymentByIds', () => {
    it('should cancel all payments by ids using default prisma', async () => {
      const ids = ['123', '456'];

      await paymentRepository.cancelAllPaymentByIds(ids);

      expect(prisma.payment.updateMany).toHaveBeenCalledWith({
        where: { transactionId: { in: ids } },
        data: { status: 'CANCELLED' }
      });
    });

    it('should cancel all payments by ids using a provided transaction instance', async () => {
      const ids = ['789', '101'];
      const mockTx = {
        payment: {
          updateMany: jest.fn()
        }
      };

      await paymentRepository.cancelAllPaymentByIds(ids, mockTx);

      expect(mockTx.payment.updateMany).toHaveBeenCalledWith({
        where: { transactionId: { in: ids } },
        data: { status: 'CANCELLED' }
      });
    });
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const payload = { transactionId: '123', snapToken: 'token' };
      const transaction = { payment: { create: jest.fn() } };

      await paymentRepository.createPayment(payload, transaction);

      expect(transaction.payment.create).toHaveBeenCalledWith({
        data: {
          transactionId: payload.transactionId,
          status: 'PENDING',
          snapToken: payload.snapToken,
          expiredAt: expect.any(Date)
        }
      });
    });
  });

  describe('getExpiredPaymentWithFlightAndPassenger', () => {
    it('should get expired payments with flight and passenger details', async () => {
      await paymentRepository.getExpiredPaymentWithFlightAndPassenger();

      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        where: {
          status: 'PENDING',
          expiredAt: { lte: expect.any(Date) }
        },
        include: {
          transaction: {
            include: {
              passenger: {
                select: {
                  departureSeatId: true,
                  returnSeatId: true
                }
              }
            }
          }
        }
      });
    });
  });
});
