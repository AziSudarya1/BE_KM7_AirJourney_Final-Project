import { describe, expect, it, jest } from '@jest/globals';

const mockCreateTransaction = jest.fn();
const mockGetDetailTransactionById = jest.fn();
const mockGetAllTransactions = jest.fn();
const mockCancelTransaction = jest.fn();
const mockGetTransactionWithFlightAndPassenger = jest.fn();
const mockInvalidateExpiredTransactions = jest.fn();

jest.unstable_mockModule('../../services/transaction.js', () => ({
  createTransaction: mockCreateTransaction,
  getDetailTransactionById: mockGetDetailTransactionById,
  getAllTransactions: mockGetAllTransactions,
  cancelTransaction: mockCancelTransaction,
  getTransactionWithFlightAndPassenger:
    mockGetTransactionWithFlightAndPassenger,
  invalidateExpiredTransactions: mockInvalidateExpiredTransactions
}));

const transactionController = await import('../transaction.js');

describe('Transaction Controller', () => {
  describe('createTransaction', () => {
    it('should call createTransaction service', async () => {
      const mockRequest = {
        body: {
          departureFlightId: 'flight1',
          returnFlightId: 'flight2',
          passengers: ['passenger1', 'passenger2']
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: { id: '1' }
        }
      };

      const data = { id: 'transaction1' };
      mockCreateTransaction.mockResolvedValueOnce(data);

      await transactionController.createTransaction(mockRequest, mockResponse);

      expect(mockCreateTransaction).toHaveBeenCalledWith({
        userId: '1',
        departureFlightId: 'flight1',
        returnFlightId: 'flight2',
        passengers: ['passenger1', 'passenger2']
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Transaction created successfully',
        data
      });
    });
  });

  describe('getDetailTransactionById', () => {
    it('should call getDetailTransactionById service', async () => {
      const mockRequest = { params: { id: 'transaction1' } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { user: { id: '1' } }
      };

      const data = { id: 'transaction1' };
      mockGetDetailTransactionById.mockResolvedValueOnce(data);

      await transactionController.getDetailTransactionById(
        mockRequest,
        mockResponse
      );

      expect(mockGetDetailTransactionById).toHaveBeenCalledWith(
        'transaction1',
        '1'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get detail transaction',
        data
      });
    });
  });

  describe('getAllTransactions', () => {
    it('should call getAllTransactions service', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: { id: 'u1' },
          filter: {
            startDate: '2023-01-01',
            endDate: '2023-01-31'
          },
          meta: {
            total: 10,
            currentPage: 1,
            totalPages: 1
          }
        }
      };

      const mockData = [
        {
          id: '1',
          amount: 100,
          userId: 'u1',
          departureFlightId: 'flight1',
          returnFlightId: 'flight2',
          passengers: ['passenger1', 'passenger2']
        }
      ];

      mockGetAllTransactions.mockResolvedValueOnce(mockData);

      await transactionController.getAllTransactions(mockRequest, mockResponse);

      expect(mockGetAllTransactions).toHaveBeenCalledWith(
        mockResponse.locals.user.id,
        mockResponse.locals.filter,
        mockResponse.locals.meta
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get all transactions',
        meta: mockResponse.locals.meta,
        data: mockData
      });
    });
  });

  describe('cancelTransaction', () => {
    it('should call cancelTransaction service', async () => {
      const mockRequest = { params: { id: 'transaction1' } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { user: { id: '1' } }
      };

      await transactionController.cancelTransaction(mockRequest, mockResponse);

      expect(mockCancelTransaction).toHaveBeenCalledWith('transaction1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Transaction canceled successfully'
      });
    });
  });

  describe('getTransactionWithFlightAndPassenger', () => {
    it('should call getTransactionWithFlightAndPassenger service', async () => {
      const mockRequest = { params: { id: 'transaction1' } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: { id: '1', email: 'user@example.com' }
        }
      };

      await transactionController.getTransactionWithFlightAndPassenger(
        mockRequest,
        mockResponse
      );

      expect(mockGetTransactionWithFlightAndPassenger).toHaveBeenCalledWith(
        'transaction1',
        '1',
        'user@example.com'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Ticket send successfully'
      });
    });
  });

  describe('invalidateExpiredTransactiona', () => {
    it('should call invalidateExpiredTransactions service', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await transactionController.invalidateExpiredTransactions(
        mockRequest,
        mockResponse
      );

      expect(mockInvalidateExpiredTransactions).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Expired transactions invalidated successfully'
      });
    });
  });
});
