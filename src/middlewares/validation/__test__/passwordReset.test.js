import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const passwordResetValidation = await import('../passwordReset.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Password Reset Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create password reset validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          email: 'example@example.com'
        }
      };

      await passwordResetValidation.resetPasswordRequestValidation(
        req,
        res,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          email: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await passwordResetValidation.resetPasswordRequestValidation(
        req,
        res,
        next
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('reset password validation', () => {
    it('should call next if validation passes', async () => {
      const req = {
        body: {
          token: 'validtoken',
          newPassword: 'newPassword'
        }
      };

      await passwordResetValidation.resetPasswordValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          token: '',
          newPassword: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await passwordResetValidation.resetPasswordValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('validate token params', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        params: {
          token: '52403432-3a3a-4a3a-a3a3-3a3a3a3a3a3a'
        }
      };

      await passwordResetValidation.validateTokenParams(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        params: {
          token: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await passwordResetValidation.validateTokenParams(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
