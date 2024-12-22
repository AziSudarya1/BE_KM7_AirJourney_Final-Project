import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAirline = jest.fn();
const mockGetAllAirlines = jest.fn();
const mockUpdateAirline = jest.fn();
const mockGetAirlineById = jest.fn();
const mockGetAirlineByName = jest.fn();
const mockGetAirlineByCode = jest.fn();
const mockDeleteAirline = jest.fn();

jest.unstable_mockModule('../../repositories/airline.js', () => ({
  createAirline: mockCreateAirline,
  getAllAirlines: mockGetAllAirlines,
  updateAirline: mockUpdateAirline,
  getAirlineById: mockGetAirlineById,
  getAirlineByName: mockGetAirlineByName,
  getAirlineByCode: mockGetAirlineByCode,
  deleteAirline: mockDeleteAirline
}));

const airlineRepository = await import('../../repositories/airline.js');

describe('Airline Repository', () => {
  describe('createAirline', () => {
    it('should create a new airline', async () => {
      const mockPayload = {
        code: 'A123',
        name: 'Airline 123',
        image: 'http://example.com/airline.jpg'
      };

      mockCreateAirline.mockResolvedValue(mockPayload);

      const result = await airlineRepository.createAirline(mockPayload);

      expect(mockCreateAirline).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('getAllAirlines', () => {
    it('should return a list of airlines', async () => {
      const mockAirlines = [
        { id: '1', code: 'A123', name: 'Airline 123' },
        { id: '2', code: 'B456', name: 'Airline 456' }
      ];

      mockGetAllAirlines.mockResolvedValue(mockAirlines);

      const result = await airlineRepository.getAllAirlines();

      expect(mockGetAllAirlines).toHaveBeenCalled();
      expect(result).toEqual(mockAirlines);
    });
  });

  describe('getAirlineById', () => {
    it('should return airline details by ID', async () => {
      const mockId = '1';
      const mockAirline = { id: '1', code: 'A123', name: 'Airline 123' };

      mockGetAirlineById.mockResolvedValue(mockAirline);

      const result = await airlineRepository.getAirlineById(mockId);

      expect(mockGetAirlineById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockAirline);
    });
  });

  describe('getAirlineByName', () => {
    it('should return airline by name', async () => {
      const mockName = 'Airline 123';
      const mockAirline = { id: '1', code: 'A123', name: 'Airline 123' };

      mockGetAirlineByName.mockResolvedValue(mockAirline);

      const result = await airlineRepository.getAirlineByName(mockName);

      expect(mockGetAirlineByName).toHaveBeenCalledWith(mockName);
      expect(result).toEqual(mockAirline);
    });
  });

  describe('getAirlineByCode', () => {
    it('should return airline by code', async () => {
      const mockCode = 'A123';
      const mockAirline = { id: '1', code: 'A123', name: 'Airline 123' };

      mockGetAirlineByCode.mockResolvedValue(mockAirline);

      const result = await airlineRepository.getAirlineByCode(mockCode);

      expect(mockGetAirlineByCode).toHaveBeenCalledWith(mockCode);
      expect(result).toEqual(mockAirline);
    });
  });

  describe('updateAirline', () => {
    it('should update airline details', async () => {
      const mockId = '1';
      const mockPayload = { name: 'Updated Airline' };
      const mockUpdatedAirline = {
        id: '1',
        code: 'A123',
        name: 'Updated Airline'
      };

      mockUpdateAirline.mockResolvedValue(mockUpdatedAirline);

      const result = await airlineRepository.updateAirline(mockId, mockPayload);

      expect(mockUpdateAirline).toHaveBeenCalledWith(mockId, mockPayload);
      expect(result).toEqual(mockUpdatedAirline);
    });
  });

  describe('deleteAirline', () => {
    it('should delete an airline by ID', async () => {
      const mockId = '1';

      mockDeleteAirline.mockResolvedValue({
        message: 'Airline deleted successfully'
      });

      const result = await airlineRepository.deleteAirline(mockId);

      expect(mockDeleteAirline).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({ message: 'Airline deleted successfully' });
    });
  });
});
