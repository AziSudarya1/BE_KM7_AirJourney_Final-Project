import { describe, expect, it, jest } from '@jest/globals';

const mockCheckMidtransTransactionValidity = jest.fn();
const mockUpdateTransactionStatus = jest.fn();

jest.unstable_mockModule('../../services/payment.js', () => ({
  updateTransactionStatus: mockUpdateTransactionStatus
}));

jest.unstable_mockModule('../../services/midtrans.js', () => ({
  checkMidtransTransactionValidity: mockCheckMidtransTransactionValidity
}));

const paymentController = await import('../payment.js');

describe('Payment Controller', () => {
  describe('handleWebhook', () => {
    it('should update transaction status', async () => {
      const mockRequest = {
        body: {
          transaction_id: 'transaction1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = {
        transaction_status: 'settlement',
        order_id: 'transaction1',
        payment_type: 'credit_card'
      };
      mockCheckMidtransTransactionValidity.mockResolvedValueOnce(data);

      await paymentController.handleWebhook(mockRequest, mockResponse);

      expect(mockCheckMidtransTransactionValidity).toHaveBeenCalledWith(
        'transaction1'
      );
      expect(mockUpdateTransactionStatus).toHaveBeenCalledWith(
        'transaction1',
        'settlement',
        'credit_card'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Transaction status updated'
      });
    });
  });
});
