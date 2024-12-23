import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirline = jest.fn();
const mockGetAirlineById = jest.fn();
const mockGetAirlineByName = jest.fn();
const mockGetAirlineByCode = jest.fn();
const mockGetAllAirline = jest.fn();
const mockUpdateAirlineById = jest.fn();
const mockDeleteAirlineById = jest.fn();

jest.unstable_mockModule('../../repositories/airline.js', () => ({
  createAirline: mockCreateAirline,
  getAirlineById: mockGetAirlineById,
  getAirlineByName: mockGetAirlineByName,
  getAirlineByCode: mockGetAirlineByCode,
  getAllAirlines: mockGetAllAirline,
  updateAirline: mockUpdateAirlineById,
  deleteAirline: mockDeleteAirlineById
}));

const airlineServices = await import('../airline.js');

describe('airlineServices', () => {
  describe('createAirline', () => {
    it('should create a new airline', async () => {
      const payload = {
        code: 'code',
        name: 'name',
        image: 'image'
      };

      const mockData = {
        id: '1',
        code: 'code',
        name: 'name',
        image: 'image'
      };

      mockCreateAirline.mockResolvedValue(mockData);

      const result = await airlineServices.createAirline(payload);

      expect(mockCreateAirline).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirlineById', () => {
    it('should get an airline by id', async () => {
      const mockId = '1';
      const mockData = {
        id: mockId,
        code: 'code',
        name: 'name',
        image: 'image'
      };

      mockGetAirlineById.mockResolvedValue(mockData);

      const result = await airlineServices.getAirlineById(mockId);

      expect(mockGetAirlineById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirlineByName', () => {
    it('should get an airline by name', async () => {
      const mockName = 'name';
      const mockData = {
        id: '1',
        code: 'code',
        name: 'name',
        image: 'image'
      };

      mockGetAirlineByName.mockResolvedValue(mockData);

      const result = await airlineServices.getAirlineByName(mockName);

      expect(mockGetAirlineByName).toHaveBeenCalledWith(mockName);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirlineByCode', () => {
    it('should get an airline by code', async () => {
      const mockCode = 'code';
      const mockData = {
        id: '1',
        code: 'code',
        name: 'name',
        image: 'image'
      };

      mockGetAirlineByCode.mockResolvedValue(mockData);

      const result = await airlineServices.getAirlineByCode(mockCode);

      expect(mockGetAirlineByCode).toHaveBeenCalledWith(mockCode);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllAirline', () => {
    it('should get all airlines', async () => {
      const mockData = [
        {
          id: '1',
          code: 'code',
          name: 'name',
          image: 'image'
        },
        {
          id: '2',
          code: 'code',
          name: 'name',
          image: 'image'
        }
      ];

      mockGetAllAirline.mockResolvedValue(mockData);

      const result = await airlineServices.getAllAirlines();

      expect(mockGetAllAirline).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('updateAirlineById', () => {
    it('should update an airline by id', async () => {
      const mockId = '1';
      const payload = {
        code: 'code',
        name: 'name',
        image: 'image'
      };

      const mockData = {
        id: mockId,
        code: 'code',
        name: 'name',
        image: 'image'
      };

      mockUpdateAirlineById.mockResolvedValue(mockData);

      const result = await airlineServices.updateAirlineById(mockId, payload);

      expect(mockUpdateAirlineById).toHaveBeenCalledWith(mockId, payload);
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteAirlineById', () => {
    it('should delete an airline by id', async () => {
      const mockId = '1';

      await airlineServices.deleteAirlineById(mockId);

      expect(mockDeleteAirlineById).toHaveBeenCalledWith(mockId);
    });
  });
});
