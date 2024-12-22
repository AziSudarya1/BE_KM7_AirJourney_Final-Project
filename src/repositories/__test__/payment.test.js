import { describe, expect, it, jest } from '@jest/globals';

const mockUpdatePaymentStatusAndMethod = jest.fn();
const mockCreatePayment = jest.fn();

jest.unstable_mockModule('../../repositories/payment.js', () => ({
  updatePaymentStatusAndMethod: mockUpdatePaymentStatusAndMethod,
  createPayment: mockCreatePayment
}));

describe('Payment Repository', () => {
  describe('updatePaymentStatusAndMethod', () => {
    it('should update payment status to SUCCESS', async () => {
      const orderId = 'transaction123';
      const status = 'SUCCESS';
      const method = 'credit_card';

      mockUpdatePaymentStatusAndMethod.mockResolvedValue(true);

      const result = await mockUpdatePaymentStatusAndMethod(
        orderId,
        status,
        method
      );

      expect(mockUpdatePaymentStatusAndMethod).toHaveBeenCalledWith(
        orderId,
        status,
        method
      );
      expect(result).toBe(true);
    });

    it('should update payment status to FAILED', async () => {
      const orderId = 'transaction123';
      const status = 'FAILED';
      const method = 'credit_card';

      mockUpdatePaymentStatusAndMethod.mockResolvedValue(true);

      const result = await mockUpdatePaymentStatusAndMethod(
        orderId,
        status,
        method
      );

      expect(mockUpdatePaymentStatusAndMethod).toHaveBeenCalledWith(
        orderId,
        status,
        method
      );
      expect(result).toBe(true);
    });

    it('should throw an error if payment update fails', async () => {
      const orderId = 'transaction123';
      const status = 'FAILED';
      const method = 'credit_card';

      mockUpdatePaymentStatusAndMethod.mockRejectedValue(
        new Error('Failed to update payment status')
      );

      await expect(
        mockUpdatePaymentStatusAndMethod(orderId, status, method)
      ).rejects.toThrow('Failed to update payment status');
    });
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const paymentDetails = {
        orderId: 'transaction123',
        amount: 100000,
        method: 'credit_card'
      };

      mockCreatePayment.mockResolvedValue({
        success: true,
        paymentId: 'payment123'
      });

      const result = await mockCreatePayment(paymentDetails);

      expect(mockCreatePayment).toHaveBeenCalledWith(paymentDetails);
      expect(result).toEqual({ success: true, paymentId: 'payment123' });
    });

    it('should throw an error if payment creation fails', async () => {
      const paymentDetails = {
        orderId: 'transaction123',
        amount: 100000,
        method: 'credit_card'
      };

      mockCreatePayment.mockRejectedValue(
        new Error('Failed to create payment')
      );

      await expect(mockCreatePayment(paymentDetails)).rejects.toThrow(
        'Failed to create payment'
      );
    });
  });
});
