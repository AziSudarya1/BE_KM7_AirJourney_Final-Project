import { afterEach, describe, expect, it, jest } from '@jest/globals';

const mockGetAirlineById = jest.fn();
const mockGetAirlineByName = jest.fn();
const mockGetAirlineByCode = jest.fn();

jest.unstable_mockModule('../../services/airline.js', () => ({
  getAirlineById: mockGetAirlineById,
  getAirlineByName: mockGetAirlineByName,
  getAirlineByCode: mockGetAirlineByCode
}));

const airlineMiddleware = await import('../airline.js');
const { HttpError } = await import('../../utils/error.js');

describe('Airline Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAirlineById', () => {
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

    it('should call next if airline exists', async () => {
      mockGetAirlineById.mockResolvedValue({ id: '1' });

      await airlineMiddleware.checkAirlineById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if airline does not exist', async () => {
      mockGetAirlineById.mockResolvedValue(null);

      await expect(
        airlineMiddleware.checkAirlineById(mockRequest, mockResponse, mockNext)
      ).rejects.toThrowError(new HttpError('Airline data not found!', 404));
    });
  });

  describe('checkAirlineCodeOrNameExist', () => {
    const mockRequest = {
      body: {
        name: 'Test Airline',
        code: 'TST'
      }
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        airline: {
          name: 'Existing Airline',
          code: 'EXIST'
        }
      }
    };

    const mockNext = jest.fn();

    it('should not check name uniqueness if the name is the same as the current airline name', async () => {
      mockRequest.body.name = 'Existing Airline';

      await airlineMiddleware.checkAirlineCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirlineByName).not.toHaveBeenCalled();
    });

    it('should call getAirlineByName if the name is different from the current airline', async () => {
      mockRequest.body.name = 'New Airline';

      mockGetAirlineByName.mockResolvedValue(null);

      await airlineMiddleware.checkAirlineCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirlineByName).toHaveBeenCalledWith('New Airline');
    });

    it('should not check code uniqueness if the code is the same as the current airline code', async () => {
      mockRequest.body.code = 'EXIST';

      await airlineMiddleware.checkAirlineCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirlineByCode).not.toHaveBeenCalled();
    });

    it('should call getAirlineByCode if the code is different from the current airline', async () => {
      mockRequest.body.code = 'NEWCODE';

      mockGetAirlineByCode.mockResolvedValue(null);

      await airlineMiddleware.checkAirlineCodeOrNameExist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetAirlineByCode).toHaveBeenCalledWith('NEWCODE');
    });

    it('should throw error if airline with the same name already exists', async () => {
      mockGetAirlineByName.mockResolvedValue({ name: 'Test Airline' });
      mockGetAirlineByCode.mockResolvedValue(null);

      await expect(
        airlineMiddleware.checkAirlineCodeOrNameExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('Airline with the same name already exists', 409)
      );
    });

    it('should throw error if airline with the same code already exists', async () => {
      mockGetAirlineByName.mockResolvedValue(null);
      mockGetAirlineByCode.mockResolvedValue({ code: 'TST' });

      await expect(
        airlineMiddleware.checkAirlineCodeOrNameExist(
          mockRequest,
          mockResponse,
          mockNext
        )
      ).rejects.toThrowError(
        new HttpError('Airline with the same code already exists', 409)
      );
    });
  });
});
