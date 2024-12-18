import { describe, expect, it, jest } from '@jest/globals';

const mockGenerateSeats = jest.fn();

jest.unstable_mockModule('../generateSeats.js', () => ({
  generateSeats: mockGenerateSeats
}));

const { generateSeats } = await import('../generateSeats.js');

describe('Generate Seats', () => {
  describe('generateSeats', () => {
    it('should generate seats without flightId', async () => {
      const mockMaxRow = 2;
      const mockMaxColumn = 3;
      const mockAeroplaneId = 'A1';

      const mockResult = [
        { row: 1, column: 1, status: 'AVAILABLE', aeroplaneId: 'A1' },
        { row: 1, column: 2, status: 'AVAILABLE', aeroplaneId: 'A1' }
      ];

      mockGenerateSeats.mockReturnValue(mockResult);

      const result = generateSeats(mockMaxRow, mockMaxColumn, mockAeroplaneId);

      expect(generateSeats).toHaveBeenCalledWith(
        mockMaxRow,
        mockMaxColumn,
        mockAeroplaneId
      );
      expect(result).toEqual(mockResult);
    });

    it('should generate seats with flightId', async () => {
      const mockMaxRow = 1;
      const mockMaxColumn = 2;
      const mockAeroplaneId = 'A1';
      const mockFlightId = 'F1';

      const mockResult = [
        {
          row: 1,
          column: 1,
          status: 'AVAILABLE',
          aeroplaneId: 'A1',
          flightId: 'F1'
        },
        {
          row: 1,
          column: 2,
          status: 'AVAILABLE',
          aeroplaneId: 'A1',
          flightId: 'F1'
        }
      ];

      mockGenerateSeats.mockReturnValue(mockResult);

      const result = generateSeats(
        mockMaxRow,
        mockMaxColumn,
        mockAeroplaneId,
        mockFlightId
      );

      expect(generateSeats).toHaveBeenCalledWith(
        mockMaxRow,
        mockMaxColumn,
        mockAeroplaneId,
        mockFlightId
      );
      expect(result).toEqual(mockResult);
    });
  });
});
