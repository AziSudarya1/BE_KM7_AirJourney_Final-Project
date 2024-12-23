import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const authValidation = await import('../auth.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Auth Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('login validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          email: 'example@example.com',
          password: 'password'
        }
      };

      await authValidation.loginValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          email: '',
          password: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await authValidation.loginValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
