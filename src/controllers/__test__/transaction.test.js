import { describe, expect, it, jest } from '@jest/globals';

const mockCreateTransaction = jest.fn();
const mockGetTransactionById = jest.fn();
const mockUpdateTransactionById = jest.fn();
const mockGetAllTransactions = jest.fn();

jest.unstable_mockModule('../../services/transaction.js', () => ({
  createTransaction: mockCreateTransaction,
  getTransactionById: mockGetTransactionById,
  updateTransactionById: mockUpdateTransactionById,
  getAllTransactions: mockGetAllTransactions
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

  describe('getTransactionById', () => {
    it('should call getTransactionById service', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const data = await transactionController.getTransactionById(
        mockRequest,
        mockResponse
      );
      expect(mockGetTransactionById).toHaveBeenCalledWith(
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
});
