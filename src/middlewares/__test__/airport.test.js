import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockGetAirportById = jest.fn();
const mockGetAirportByName = jest.fn();
const mockGetAirportByCode = jest.fn();

jest.unstable_mockModule('../../services/airport.js', () => ({
  getAirportById: mockGetAirportById,
  getAirportByName: mockGetAirportByName,
  getAirportByCode: mockGetAirportByCode
}));

const airportMiddleware = await import('../airport.js');
const { HttpError } = await import('../../utils/error.js');

describe('Airport Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAirportIdExist', () => {
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

    it('should call next if airport exists', async () => {
      mockGetAirportById.mockResolvedValue({ id: '1' });

      await airportMiddleware.checkAirportIdExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if airport does not exist', async () => {
      mockGetAirportById.mockResolvedValue(null);

      await expect(
        airportMiddleware.checkAirportIdExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrow(new HttpError('Airport not found', 404));
    });
  });

  describe('checkAirportNameOrCodeExist', () => {
    const mockRequest = {
      body: {
        name: 'Test Airport',
        code: 'TST'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        airport: {
          name: 'Existing Airport',
          code: 'EXIST'
        }
      }
    };

    const mockNext = jest.fn();

    it('should not check name uniqueness if the name is the same as the current airport name', async () => {
      mockRequest.body.name = 'Existing Airport';

      await airportMiddleware.checkAirportCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirportByName).not.toHaveBeenCalled();
    });

    it('should call getAirportByName if the name is different from the current airport', async () => {
      mockRequest.body.name = 'New Airport';

      mockGetAirportByName.mockResolvedValue(null);

      await airportMiddleware.checkAirportCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirportByName).toHaveBeenCalledWith('New Airport');
    });

    it('should not check code uniqueness if the code is the same as the current airport code', async () => {
      mockRequest.body.code = 'EXIST';

      await airportMiddleware.checkAirportCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirportByCode).not.toHaveBeenCalled();
    });

    it('should call getAirportByCode if the code is different from the current airport', async () => {
      mockRequest.body.code = 'NEWCODE';

      mockGetAirportByCode.mockResolvedValue(null);

      await airportMiddleware.checkAirportCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirportByCode).toHaveBeenCalledWith('NEWCODE');
    });

    it('should throw error if airport with the same name already exists', async () => {
      mockGetAirportByName.mockResolvedValue({ name: 'Test Airport' });
      mockGetAirportByCode.mockResolvedValue(null);

      await expect(
        airportMiddleware.checkAirportCodeOrNameExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrow(
        new HttpError('Airport with the same name already exists', 409)
      );
    });

    it('should throw error if airport with the same code already exists', async () => {
      mockGetAirportByName.mockResolvedValue(null);
      mockGetAirportByCode.mockResolvedValue({ code: 'TST' });

      await expect(
        airportMiddleware.checkAirportCodeOrNameExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrow(
        new HttpError('Airport with the same code already exists', 409)
      );
    });
  });
});
