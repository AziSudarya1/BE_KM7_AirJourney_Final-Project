import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockCountTransactionDataWithFilterAndCreateMeta = jest.fn();

jest.unstable_mockModule('../../services/transaction.js', () => ({
  countTransactionDataWithFilterAndCreateMeta:
    mockCountTransactionDataWithFilterAndCreateMeta
}));

const transactionMiddleware = await import('../transaction.js');

describe('Transaction Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getMaxTransactionDataAndCreateMeta', () => {
    const mockResponse = {
      locals: {
        filter: { status: 'completed' },
        page: 2,
        user: { id: 1 }
      }
    };

    const mockNext = jest.fn();

    it('should call next and set meta in locals', async () => {
      const mockMeta = {
        total: 50,
        currentPage: 2,
        totalPages: 5
      };

      mockCountTransactionDataWithFilterAndCreateMeta.mockResolvedValue(
        mockMeta
      );

      await transactionMiddleware.getMaxTransactionDataAndCreateMeta(
        {},
        mockResponse,
        mockNext
      );

      expect(
        mockCountTransactionDataWithFilterAndCreateMeta
      ).toHaveBeenCalledWith({ status: 'completed' }, 2, 1);
      expect(mockResponse.locals.meta).toEqual(mockMeta);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw an error if service fails', async () => {
      const error = new Error('Service failed');
      mockCountTransactionDataWithFilterAndCreateMeta.mockRejectedValue(error);

      await expect(
        transactionMiddleware.getMaxTransactionDataAndCreateMeta(
          {},
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError('Service failed');

      expect(
        mockCountTransactionDataWithFilterAndCreateMeta
      ).toHaveBeenCalledWith({ status: 'completed' }, 2, 1);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
