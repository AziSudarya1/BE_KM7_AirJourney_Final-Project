import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockGetAeroplaneById = jest.fn();
const mockGetAeroplaneByName = jest.fn();
const mockGetAeroplaneByCode = jest.fn();

jest.unstable_mockModule('../../services/aeroplane.js', () => ({
  getAeroplaneById: mockGetAeroplaneById,
  getAeroplaneByName: mockGetAeroplaneByName,
  getAeroplaneByCode: mockGetAeroplaneByCode
}));

const aeroplaneMiddleware = await import('../aeroplane.js');
const { HttpError } = await import('../../utils/error.js');

describe('Aeroplane Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAeroplaneById', () => {
    const mockRequest = {
      params: {
        id: '1'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if aeroplane exists', async () => {
      mockGetAeroplaneById.mockResolvedValue({ id: '1' });

      await aeroplaneMiddleware.checkAeroplaneById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if aeroplane does not exist', async () => {
      mockGetAeroplaneById.mockResolvedValue(null);

      await expect(
        aeroplaneMiddleware.checkAeroplaneById(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(new HttpError('Aeroplane data not Found!', 404));
    });
  });

  describe('checkAeroplaneNameOrCodeExist', () => {
    const mockRequest = {
      body: {
        name: 'Test Aeroplane',
        code: 'TST'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        aeroplane: {
          name: 'Existing Aeroplane',
          code: 'EXIST'
        }
      }
    };

    const mockNext = jest.fn();

    it('should not check name uniqueness if the name is the same as the current aeroplane name', async () => {
      mockRequest.body.name = 'Existing Aeroplane';

      await aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAeroplaneByName).not.toHaveBeenCalled();
    });

    it('should call getAeroplaneByName if the name is different from the current aeroplane', async () => {
      mockRequest.body.name = 'New Aeroplane';

      mockGetAeroplaneByName.mockResolvedValue(null);

      await aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAeroplaneByName).toHaveBeenCalledWith('New Aeroplane');
    });

    it('should not check code uniqueness if the code is the same as the current aeroplane code', async () => {
      mockRequest.body.code = 'EXIST';

      await aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAeroplaneByCode).not.toHaveBeenCalled();
    });

    it('should call getAeroplaneByCode if the code is different from the current aeroplane', async () => {
      mockRequest.body.code = 'NEWCODE';

      mockGetAeroplaneByCode.mockResolvedValue(null);

      await aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAeroplaneByCode).toHaveBeenCalledWith('NEWCODE');
    });

    it('should throw error if aeroplane with the same name already exists', async () => {
      mockGetAeroplaneByName.mockResolvedValue({ name: 'Test Aeroplane' });
      mockGetAeroplaneByCode.mockResolvedValue(null);

      await expect(
        aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('Aeroplane with the same name already exist!', 409)
      );
    });

    it('should throw error if aeroplane with the same code already exists', async () => {
      mockGetAeroplaneByName.mockResolvedValue(null);
      mockGetAeroplaneByCode.mockResolvedValue({ code: 'TST' });

      await expect(
        aeroplaneMiddleware.checkAeroplaneNameOrCodeExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('Aeroplane with the same code already exist!', 409)
      );
    });
  });

  describe('getAeroplaneViaBody', () => {
    const mockRequest = {
      body: {
        id: '1'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    const mockNext = jest.fn();

    it('should call next if aeroplane exists', async () => {
      mockGetAeroplaneById.mockResolvedValue({ id: '1' });

      await aeroplaneMiddleware.getAeroplaneViaBody(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if aeroplane does not exist', async () => {
      mockGetAeroplaneById.mockResolvedValue(null);

      await expect(
        aeroplaneMiddleware.getAeroplaneViaBody(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(new HttpError('Aeroplane data not found!', 404));
    });
  });
});
