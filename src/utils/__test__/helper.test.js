import { describe, expect, it } from '@jest/globals';
import { generateOtp, generateJoiError, calculateAmount } from '../helper';

describe('Utility Functions', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOtp();

      expect(otp).toHaveLength(6);
      expect(Number(otp)).toBeGreaterThanOrEqual(100000);
      expect(Number(otp)).toBeLessThan(1000000);
    });
  });

  describe('generateJoiError', () => {
    it('should extract error messages from Joi error object', () => {
      const mockError = {
        details: [
          { message: 'Invalid field' },
          { message: 'Missing required field' }
        ]
      };

      const result = generateJoiError(mockError);

      expect(result).toEqual(['Invalid field', 'Missing required field']);
    });
  });

  describe('calculateAmount', () => {
    it('should calculate total amount for non-infant passengers', () => {
      const mockPassengers = [
        { type: 'ADULT' },
        { type: 'INFANT' },
        { type: 'ADULT' }
      ];
      const mockDeparturePrice = 100;
      const mockReturnPrice = 50;
      const mockReturnFlightId = '1';

      const result = calculateAmount(
        mockPassengers,
        mockDeparturePrice,
        mockReturnPrice,
        mockReturnFlightId
      );

      expect(result).toBe(300);
    });

    it('should calculate total amount for non-infant passengers with no return flight', () => {
      const mockPassengers = [
        { type: 'ADULT' },
        { type: 'INFANT' },
        { type: 'ADULT' }
      ];
      const mockDeparturePrice = 100;
      const mockReturnPrice = 50;
      const mockReturnFlightId = null;

      const result = calculateAmount(
        mockPassengers,
        mockDeparturePrice,
        mockReturnPrice,
        mockReturnFlightId
      );

      expect(result).toBe(200);
    });
  });
});
