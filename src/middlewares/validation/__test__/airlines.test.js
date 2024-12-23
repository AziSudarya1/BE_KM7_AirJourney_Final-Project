import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const airlinesValidation = await import('../airline.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Airlines Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create airlines validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          code: 'A1',
          name: 'Airline 1',
          image: 'https://example.com/image.png'
        }
      };

      await airlinesValidation.createAirlineValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          code: '',
          name: '',
          image: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await airlinesValidation.createAirlineValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('update airlines validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        body: {
          code: 'A1',
          name: 'Airline 1',
          image: 'https://example.com/image.png'
        }
      };

      await airlinesValidation.updateAirlineValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          code: '',
          name: '',
          image: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await airlinesValidation.updateAirlineValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
