import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const commonValidation = await import('../common.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Common Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create common validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        params: {
          id: '48732904-3c9f-4f0c-8f0e-5f5f5f5f5f5f'
        }
      };

      await commonValidation.validateIdParams(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        params: {
          id: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await commonValidation.validateIdParams(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
