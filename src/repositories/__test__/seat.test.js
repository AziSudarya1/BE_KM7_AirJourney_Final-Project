import { describe, expect, it, jest } from '@jest/globals';

const mockUpdateSeatStatusBySeats = jest.fn();

jest.unstable_mockModule('../../repositories/seat.js', () => ({
  updateSeatStatusBySeats: mockUpdateSeatStatusBySeats
}));

const seatRepository = await import('../../repositories/seat.js');

describe('Seat Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSeatStatusBySeats', () => {
    it('should update the status of multiple seats', async () => {
      const mockSeatIds = ['seat1', 'seat2', 'seat3'];
      const mockStatus = 'BOOKED';
      const mockTransaction = { id: 'mockTransactionId' };

      const mockUpdatedResponse = { count: 3 };

      mockUpdateSeatStatusBySeats.mockResolvedValue(mockUpdatedResponse);

      const result = await seatRepository.updateSeatStatusBySeats(
        mockSeatIds,
        mockStatus,
        mockTransaction
      );

      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledTimes(1);
      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        mockSeatIds,
        mockStatus,
        mockTransaction
      );
      expect(result).toEqual(mockUpdatedResponse);
    });

    it('should default to prisma if no transaction is provided', async () => {
      const mockSeatIds = ['seat1', 'seat2', 'seat3'];
      const mockStatus = 'AVAILABLE';

      const mockUpdatedResponse = { count: 3 };

      mockUpdateSeatStatusBySeats.mockResolvedValue(mockUpdatedResponse);

      const result = await seatRepository.updateSeatStatusBySeats(
        mockSeatIds,
        mockStatus
      );

      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledTimes(1);
      expect(mockUpdateSeatStatusBySeats.mock.calls[0]).toEqual([
        mockSeatIds,
        mockStatus
      ]);
      expect(result).toEqual(mockUpdatedResponse);
    });
  });
});
