import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirport = jest.fn();
const mockGetAirportById = jest.fn();
const mockGetAirportByName = jest.fn();
const mockGetAirportByCode = jest.fn();
const mockUpdateAirport = jest.fn();
const mockDeleteAirport = jest.fn();
const mockGetAllAirports = jest.fn();

jest.unstable_mockModule('../../repositories/airport.js', () => ({
  createAirport: mockCreateAirport,
  getAirportById: mockGetAirportById,
  getAirportByName: mockGetAirportByName,
  getAirportByCode: mockGetAirportByCode,
  updateAirport: mockUpdateAirport,
  deleteAirport: mockDeleteAirport,
  getAllAirports: mockGetAllAirports
}));

const airportServices = await import('../airport.js');

describe('Airport Services', () => {
  describe('createAirport', () => {
    it('should create a new airport', async () => {
      const payload = {
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      const mockData = {
        id: '1',
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      mockCreateAirport.mockResolvedValue(mockData);

      const result = await airportServices.createAirport(payload);

      expect(mockCreateAirport).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirportById', () => {
    it('should get an airport by id', async () => {
      const mockId = '1';
      const mockData = {
        id: mockId,
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      mockGetAirportById.mockResolvedValue(mockData);

      const result = await airportServices.getAirportById(mockId);

      expect(mockGetAirportById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirportByName', () => {
    it('should get an airport by name', async () => {
      const mockName = 'Airport 1';
      const mockData = {
        id: '1',
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      mockGetAirportByName.mockResolvedValue(mockData);

      const result = await airportServices.getAirportByName(mockName);

      expect(mockGetAirportByName).toHaveBeenCalledWith(mockName);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAirportByCode', () => {
    it('should get an airport by code', async () => {
      const mockCode = 'A1';
      const mockData = {
        id: '1',
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      mockGetAirportByCode.mockResolvedValue(mockData);

      const result = await airportServices.getAirportByCode(mockCode);

      expect(mockGetAirportByCode).toHaveBeenCalledWith(mockCode);
      expect(result).toEqual(mockData);
    });
  });

  describe('updateAirport', () => {
    it('should update an airport', async () => {
      const mockId = '1';
      const payload = {
        code: 'A1',
        name: 'Airport 1',
        continent: 'Asia',
        city: 'City 1',
        country: 'Country 1'
      };

      const mockData = {
        id: mockId,
        name: 'Airport 2',
        code: 'A2'
      };

      mockUpdateAirport.mockResolvedValue(mockData);

      const result = await airportServices.updateAirport(mockId, payload);

      expect(mockUpdateAirport).toHaveBeenCalledWith(mockId, payload);
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteAirport', () => {
    it('should delete an airport', async () => {
      const mockId = '1';

      await airportServices.deleteAirport(mockId);

      expect(mockDeleteAirport).toHaveBeenCalledWith(mockId);
    });
  });

  describe('getAllAirports', () => {
    it('should get all airports', async () => {
      const mockData = [
        {
          id: '1',
          code: 'A1',
          name: 'Airport 1',
          continent: 'Asia',
          city: 'City 1',
          country: 'Country 1'
        },
        {
          id: '2',
          code: 'A2',
          name: 'Airport 2',
          continent: 'Asia',
          city: 'City 2',
          country: 'Country 2'
        }
      ];

      mockGetAllAirports.mockResolvedValue(mockData);

      const result = await airportServices.getAllAirports();

      expect(mockGetAllAirports).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
});
