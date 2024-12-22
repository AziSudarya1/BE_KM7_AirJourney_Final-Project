import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAeroplane = jest.fn();
const mockGetAeroplaneById = jest.fn();
const mockGetAeroplaneByName = jest.fn();
const mockGetAeroplaneByCode = jest.fn();
const mockUpdateAeroplane = jest.fn();
const mockDeleteAeroplane = jest.fn();
const mockGetAllAeroplanes = jest.fn();

jest.unstable_mockModule('../../repositories/aeroplane.js', () => ({
  createAeroplane: mockCreateAeroplane,
  getAeroplaneById: mockGetAeroplaneById,
  getAeroplaneByName: mockGetAeroplaneByName,
  getAeroplaneByCode: mockGetAeroplaneByCode,
  updateAeroplane: mockUpdateAeroplane,
  deleteAeroplane: mockDeleteAeroplane,
  getAllAeroplanes: mockGetAllAeroplanes
}));

const aeroplaneRepository = await import('../../repositories/aeroplane.js');

describe('Aeroplane Repository', () => {
  describe('createAeroplane', () => {
    it('should create a new aeroplane', async () => {
      const mockPayload = {
        name: 'Aeroplane 1',
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };
      const mockResult = { id: 'aeroplane123', ...mockPayload };

      mockCreateAeroplane.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.createAeroplane(mockPayload);

      expect(mockCreateAeroplane).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAeroplaneById', () => {
    it('should return an aeroplane by ID', async () => {
      const id = 'aeroplane123';
      const mockResult = {
        id,
        name: 'Aeroplane 1',
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockGetAeroplaneById.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.getAeroplaneById(id);

      expect(mockGetAeroplaneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAeroplaneByName', () => {
    it('should return an aeroplane by name', async () => {
      const name = 'Aeroplane 1';
      const mockResult = {
        id: 'aeroplane123',
        name,
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockGetAeroplaneByName.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.getAeroplaneByName(name);

      expect(mockGetAeroplaneByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAeroplaneByCode', () => {
    it('should return an aeroplane by code', async () => {
      const code = 'A1';
      const mockResult = {
        id: 'aeroplane123',
        name: 'Aeroplane 1',
        code,
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockGetAeroplaneByCode.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.getAeroplaneByCode(code);

      expect(mockGetAeroplaneByCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateAeroplane', () => {
    it('should update an aeroplane by ID', async () => {
      const id = 'aeroplane123';
      const mockPayload = {
        name: 'Updated Aeroplane',
        maxRow: 12,
        maxColumn: 6
      };
      const mockResult = {
        id,
        name: 'Updated Aeroplane',
        code: 'A1',
        type: 'Type 1',
        maxRow: 12,
        maxColumn: 6
      };

      mockUpdateAeroplane.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.updateAeroplane(id, mockPayload);

      expect(mockUpdateAeroplane).toHaveBeenCalledWith(id, mockPayload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteAeroplane', () => {
    it('should delete an aeroplane by ID', async () => {
      const id = 'aeroplane123';

      mockDeleteAeroplane.mockResolvedValue({
        message: 'Aeroplane deleted successfully'
      });

      const result = await aeroplaneRepository.deleteAeroplane(id);

      expect(mockDeleteAeroplane).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Aeroplane deleted successfully' });
    });
  });

  describe('getAllAeroplanes', () => {
    it('should return all aeroplanes', async () => {
      const mockResult = [
        {
          id: 'aeroplane123',
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        },
        {
          id: 'aeroplane456',
          name: 'Aeroplane 2',
          code: 'A2',
          type: 'Type 2',
          maxRow: 12,
          maxColumn: 6
        }
      ];

      mockGetAllAeroplanes.mockResolvedValue(mockResult);

      const result = await aeroplaneRepository.getAllAeroplanes();

      expect(mockGetAllAeroplanes).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
