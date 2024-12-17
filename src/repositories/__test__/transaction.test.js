import { describe, expect, it, jest } from '@jest/globals';

const mockCreateTransactionAndPassenger = jest.fn();
const mockGetActiveTransaction = jest.fn();
const mockGetTransactionWithUserById = jest.fn();
const mockGetDetailTransactionById = jest.fn();
const mockGetAllTransactions = jest.fn();

jest.unstable_mockModule('../../repositories/transaction.js', () => ({
  createTransactionAndPassenger: mockCreateTransactionAndPassenger,
  getActiveTransaction: mockGetActiveTransaction,
  getTransactionWithUserById: mockGetTransactionWithUserById,
  getDetailTransactionById: mockGetDetailTransactionById,
  getAllTransactions: mockGetAllTransactions
}));

const transactionRepository = await import('../../repositories/transaction.js');

describe('Transaction Repository', () => {
  describe('createTransactionAndPassenger', () => {
    it('should create a new transaction with passengers', async () => {
      const mockPayload = {
        amount: 1000000,
        userId: 'user123',
        departureFlightId: 'flight123',
        returnFlightId: 'flight456',
        proccessedPassengers: [
          {
            title: 'Mr',
            firstName: 'John',
            familyName: 'Doe',
            birthday: '1990-01-01',
            nationality: 'ID',
            type: 'ADULT',
            identityNumber: '123456789',
            originCountry: 'ID',
            expiredAt: '2030-01-01',
            departureSeatId: 'seat1',
            returnSeatId: 'seat2'
          }
        ]
      };
      const mockResult = { id: 'transaction123', ...mockPayload };

      mockCreateTransactionAndPassenger.mockResolvedValue(mockResult);

      const result = await transactionRepository.createTransactionAndPassenger(
        mockPayload,
        {}
      );

      expect(mockCreateTransactionAndPassenger).toHaveBeenCalledWith(
        mockPayload,
        {}
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getActiveTransaction', () => {
    it('should return an active transaction for a user', async () => {
      const userId = 'user123';
      const mockResult = {
        id: 'transaction123',
        userId,
        payment: {
          status: 'PENDING',
          expiredAt: new Date(Date.now() + 3600000)
        }
      };

      mockGetActiveTransaction.mockResolvedValue(mockResult);

      const result = await transactionRepository.getActiveTransaction(userId);

      expect(mockGetActiveTransaction).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getTransactionWithUserById', () => {
    it('should return a transaction with user details by ID', async () => {
      const transactionId = 'transaction123';
      const mockResult = {
        id: transactionId,
        user: { id: 'user123', name: 'John Doe' }
      };

      mockGetTransactionWithUserById.mockResolvedValue(mockResult);

      const result =
        await transactionRepository.getTransactionWithUserById(transactionId);

      expect(mockGetTransactionWithUserById).toHaveBeenCalledWith(
        transactionId
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getDetailTransactionById', () => {
    it('should return detailed transaction data by ID', async () => {
      const transactionId = 'transaction123';
      const mockResult = {
        id: transactionId,
        amount: 1000000,
        user: { id: 'user123', name: 'John Doe' },
        payment: { status: 'SUCCESS' },
        passenger: []
      };

      mockGetDetailTransactionById.mockResolvedValue(mockResult);

      const result =
        await transactionRepository.getDetailTransactionById(transactionId);

      expect(mockGetDetailTransactionById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions for a user with filters', async () => {
      const userId = 'user123';
      const filters = { status: 'PENDING' };
      const mockResult = [
        { id: 'transaction123', userId, amount: 1000000 },
        { id: 'transaction456', userId, amount: 500000 }
      ];

      mockGetAllTransactions.mockResolvedValue(mockResult);

      const result = await transactionRepository.getAllTransactions(
        userId,
        filters
      );

      expect(mockGetAllTransactions).toHaveBeenCalledWith(userId, filters);
      expect(result).toEqual(mockResult);
    });
  });
});
