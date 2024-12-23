import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirport = jest.fn();
const mockGetAllAirports = jest.fn();
const mockGetAirportById = jest.fn();
const mockUpdateAirport = jest.fn();
const mockDeleteAirport = jest.fn();
const mockGetAirportByName = jest.fn();
const mockGetAirportByCode = jest.fn();

jest.unstable_mockModule('../../repositories/airport.js', () => ({
  createAirport: mockCreateAirport,
  getAirportById: mockGetAirportById,
  getAirportByName: mockGetAirportByName,
  getAirportByCode: mockGetAirportByCode,
  updateAirport: mockUpdateAirport,
  deleteAirport: mockDeleteAirport,
  getAllAirports: mockGetAllAirports
}));

const airportRepository = await import('../../repositories/airport.js');

describe('Airport Repository Tests', () => {
  describe('createAirport', () => {
    it('should create a new airport', async () => {
      const mockAirportData = {
        name: 'Soekarno-Hatta',
        code: 'CGK',
        continent: 'ASIA',
        city: 'Jakarta',
        country: 'Indonesia'
      };

      mockCreateAirport.mockResolvedValue(mockAirportData);

      const result = await airportRepository.createAirport(mockAirportData);

      expect(mockCreateAirport).toHaveBeenCalledWith(mockAirportData);
      expect(result).toEqual(mockAirportData);
    });
  });

  describe('getAllAirports', () => {
    it('should return a list of airports', async () => {
      const mockAirports = [
        { id: '1', name: 'Soekarno-Hatta', code: 'CGK', city: 'Jakarta' },
        { id: '2', name: 'Ngurah Rai', code: 'DPS', city: 'Denpasar' }
      ];

      mockGetAllAirports.mockResolvedValue(mockAirports);

      const result = await airportRepository.getAllAirports();

      expect(mockGetAllAirports).toHaveBeenCalled();
      expect(result).toEqual(mockAirports);
    });
  });

  describe('getAirportById', () => {
    it('should return an airport by ID', async () => {
      const mockAirport = {
        id: '1',
        name: 'Soekarno-Hatta',
        code: 'CGK',
        city: 'Jakarta',
        continent: 'ASIA',
        country: 'Indonesia'
      };

      mockGetAirportById.mockResolvedValue(mockAirport);

      const result = await airportRepository.getAirportById('1');

      expect(mockGetAirportById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockAirport);
    });
  });

  describe('updateAirport', () => {
    it('should update airport data', async () => {
      const mockUpdatedAirport = {
        id: '1',
        name: 'Updated Airport',
        code: 'CGK',
        city: 'Jakarta'
      };

      mockUpdateAirport.mockResolvedValue(mockUpdatedAirport);

      const result = await airportRepository.updateAirport('1', {
        name: 'Updated Airport'
      });

      expect(mockUpdateAirport).toHaveBeenCalledWith('1', {
        name: 'Updated Airport'
      });
      expect(result).toEqual(mockUpdatedAirport);
    });
  });

  describe('deleteAirport', () => {
    it('should delete an airport by ID', async () => {
      const mockResponse = { message: 'Airport deleted successfully' };

      mockDeleteAirport.mockResolvedValue(mockResponse);

      const result = await airportRepository.deleteAirport('1');

      expect(mockDeleteAirport).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAirportByName', () => {
    it('should return an airport by name', async () => {
      const mockAirport = {
        id: '1',
        name: 'Soekarno-Hatta',
        code: 'CGK',
        city: 'Jakarta',
        continent: 'ASIA',
        country: 'Indonesia'
      };

      mockGetAirportByName.mockResolvedValue(mockAirport);

      const result = await airportRepository.getAirportByName('Soekarno-Hatta');

      expect(mockGetAirportByName).toHaveBeenCalledWith('Soekarno-Hatta');
      expect(result).toEqual(mockAirport);
    });
  });

  describe('getAirportByCode', () => {
    it('should return an airport by code', async () => {
      const mockAirport = {
        id: '1',
        name: 'Soekarno-Hatta',
        code: 'CGK',
        city: 'Jakarta',
        continent: 'ASIA',
        country: 'Indonesia'
      };

      mockGetAirportByCode.mockResolvedValue(mockAirport);

      const result = await airportRepository.getAirportByCode('CGK');

      expect(mockGetAirportByCode).toHaveBeenCalledWith('CGK');
      expect(result).toEqual(mockAirport);
    });
  });
});
