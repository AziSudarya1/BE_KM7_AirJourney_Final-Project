import { describe, expect, it, jest } from '@jest/globals';

const mockValidatePassengers = jest.fn();

jest.unstable_mockModule('../validatePassengers.js', () => ({
  validatePassengers: mockValidatePassengers
}));

const { validatePassengers } = await import('../validatePassengers');

describe('Validate Passengers', () => {
  describe('validatePassengers', () => {
    it('should validate passengers successfully', async () => {
      const mockPassengers = [
        { type: 'ADULT', departureSeatId: 'D1', identityNumber: '12345' }
      ];
      const mockDepartureSeats = [{ id: 'D1', status: 'AVAILABLE' }];

      const mockResult = {
        seatIds: ['D1'],
        proccessedPassengers: [
          { type: 'ADULT', departureSeatId: 'D1', identityNumber: '12345' }
        ]
      };

      mockValidatePassengers.mockResolvedValue(mockResult);

      const result = await validatePassengers(
        mockPassengers,
        false,
        mockDepartureSeats,
        []
      );

      expect(validatePassengers).toHaveBeenCalledWith(
        mockPassengers,
        false,
        mockDepartureSeats,
        []
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw error if seat not found', async () => {
      const mockPassengers = [
        { type: 'ADULT', departureSeatId: 'D2', identityNumber: '12345' }
      ];
      const mockDepartureSeats = [{ id: 'D1', status: 'AVAILABLE' }];

      mockValidatePassengers.mockRejectedValue(
        new Error('Departure seat not found')
      );

      await expect(
        validatePassengers(mockPassengers, false, mockDepartureSeats, [])
      ).rejects.toThrow('Departure seat not found');
    });
  });
});
