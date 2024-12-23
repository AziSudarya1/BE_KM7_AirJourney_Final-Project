import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const transactionValidation = await import('../transaction.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Transaction Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    locals: {}
  };

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    res.locals = {};
  });

  describe('create transaction validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        body: {
          departureFlightId: '123e4567-e89b-12d3-a456-426614174000',
          returnFlightId: '123e4567-e89b-12d3-a456-426614174001',
          passengers: [
            {
              title: 'Mr.',
              firstName: 'John',
              familyName: 'Doe',
              birthday: '1990-01-01',
              nationality: 'US',
              type: 'ADULT',
              identityNumber: '3038451315233212',
              originCountry: 'US',
              expiredAt: '2030-01-01',
              departureSeatId: '123e4567-e89b-12d3-a456-426614174002',
              returnSeatId: '123e4567-e89b-12d3-a456-426614174003'
            }
          ]
        }
      };

      await transactionValidation.createTransactionValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if Joi validation fails', async () => {
      const req = {
        body: {
          departureFlightId: '',
          returnFlightId: '',
          passengers: []
        }
      };

      const joiError = new Error('Validation error');
      joiError.isJoi = true;
      generateJoiError.mockReturnValue('Validation error details');

      await transactionValidation.createTransactionValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation error details'
      });
    });
  });

  describe('get transaction filter validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        query: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          page: '1'
        }
      };

      await transactionValidation.getTransactionFilterValidation(
        req,
        res,
        next
      );

      expect(res.locals.filter).toEqual({
        createdAt: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-12-31')
        }
      });
      expect(res.locals.page).toBe(1);
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if Joi validation fails', async () => {
      const req = {
        query: {
          startDate: '',
          endDate: '',
          page: ''
        }
      };

      const joiError = new Error('Validation error');
      joiError.isJoi = true;
      generateJoiError.mockReturnValue('Validation error details');

      await transactionValidation.getTransactionFilterValidation(
        req,
        res,
        next
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation error details'
      });
    });

    it('should set default page to 1 if page query is not provided', async () => {
      const req = {
        query: {
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      };

      await transactionValidation.getTransactionFilterValidation(
        req,
        res,
        next
      );

      expect(res.locals.page).toBe(1);
      expect(next).toHaveBeenCalled();
    });

    it('should set default page to 1 if page query is not provided', async () => {
      const req = {
        query: {
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      };

      await transactionValidation.getTransactionFilterValidation(
        req,
        res,
        next
      );

      expect(res.locals.page).toBe(1);
      expect(next).toHaveBeenCalled();
    });
  });
});
