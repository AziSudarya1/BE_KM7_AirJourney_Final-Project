import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const airportValidation = await import('../airport.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Airport Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create airport validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          name: 'Airport 1',
          code: 'A1',
          continent: 'ASIA',
          city: 'City 1',
          country: 'Country 1'
        }
      };

      await airportValidation.createAirportValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          name: '',
          code: '',
          Continent: '',
          city: '',
          country: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await airportValidation.createAirportValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('update airport validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        body: {
          name: 'Airport 1',
          code: 'A1',
          continent: 'ASIA',
          city: 'City 1',
          country: 'Country 1'
        }
      };

      await airportValidation.updateAirportValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          name: '',
          code: '',
          Continent: '',
          city: '',
          country: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await airportValidation.updateAirportValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
