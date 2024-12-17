import { describe, expect, it, jest } from '@jest/globals';

const mockCreateTransaction = jest.fn();
const mockGetDetailTransactionById = jest.fn();
const mockGetAllTransactions = jest.fn();
const mockCancleTransaction = jest.fn();

jest.unstable_mockModule('../../services/transaction.js', () => ({
  createTransaction: mockCreateTransaction,
  getDetailTransactionById: mockGetDetailTransactionById,
  getAllTransactions: mockGetAllTransactions,
  cancelTransaction: mockCancleTransaction
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
          user: {
            id: '1'
          }
        }
      };

      const data = await transactionController.createTransaction(
        mockRequest,
        mockResponse
      );
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
      const mockRequest = {
        params: {
          id: 'u1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: 'u1'
          }
        }
      };

      const data = await transactionController.getDetailTransactionById(
        mockRequest,
        mockResponse
      );
      expect(mockGetDetailTransactionById).toHaveBeenCalledWith(
        mockResponse.locals.user.id,
        mockRequest.params.id
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
          user: {
            id: 'u1'
          },
          filter: {
            startDate: '2023-01-01',
            endDate: '2023-01-31'
          }
        }
      };

      const mockData = [
        {
          id: '1',
          ammount: 100,
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
        {
          startDate: mockResponse.locals.filter.startDate,
          endDate: mockResponse.locals.filter.endDate
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully get all transactions',
        data: mockData
      });
    });
  });

  describe('cancelTransaction', () => {
    it('should call cancelTransaction service', async () => {
      const mockRequest = {
        params: {
          id: 'u1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: {
            id: 'u1'
          }
        }
      };

      await transactionController.cancelTransaction(mockRequest, mockResponse);

      expect(mockCancleTransaction).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockResponse.locals.user.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Transaction canceled successfully'
      });
    });
  });
});
