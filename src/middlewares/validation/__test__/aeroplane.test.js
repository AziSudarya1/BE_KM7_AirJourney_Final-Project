import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const aeroPlaneValidation = await import('../aeroplane.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Aeroplane Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create aeroplane validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        }
      };

      await aeroPlaneValidation.createAeroplaneValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          name: '',
          code: '',
          type: '',
          maxRow: 0,
          maxColumn: 0
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await aeroPlaneValidation.createAeroplaneValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('update aeroplane validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        body: {
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        }
      };

      await aeroPlaneValidation.updateAeroplaneValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          name: '',
          code: '',
          type: '',
          maxRow: 0,
          maxColumn: 0
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await aeroPlaneValidation.updateAeroplaneValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
