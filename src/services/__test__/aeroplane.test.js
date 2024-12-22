import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAeroplane = jest.fn();
const mockGetAeroplaneById = jest.fn();
const mockgetAeroplaneByName = jest.fn();
const mockGetAeroplaneByCode = jest.fn();
const mockUpdateAeroplaneById = jest.fn();
const mockDeleteAeroplaneById = jest.fn();
const mockGetAllAeroplanes = jest.fn();

jest.unstable_mockModule('../../repositories/aeroplane.js', () => ({
  createAeroplane: mockCreateAeroplane,
  getAeroplaneById: mockGetAeroplaneById,
  getAeroplaneByName: mockgetAeroplaneByName,
  getAeroplaneByCode: mockGetAeroplaneByCode,
  updateAeroplane: mockUpdateAeroplaneById,
  deleteAeroplane: mockDeleteAeroplaneById,
  getAllAeroplanes: mockGetAllAeroplanes
}));

const aeroplaneServices = await import('../aeroplane.js');

describe('Aeroplane Services', () => {
  describe('createAeroplane', () => {
    it('should create a new aeroplane', async () => {
      const payload = {
        name: 'Aeroplane 1',
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      const mockAeroplaneData = {
        id: '1',
        ...payload
      };

      mockCreateAeroplane.mockResolvedValue(mockAeroplaneData);

      const result = await aeroplaneServices.createAeroplane(payload);

      expect(mockCreateAeroplane).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockAeroplaneData);
    });
  });

  describe('getAeroplaneById', () => {
    it('should get an aeroplane by id', async () => {
      const mockAeroplaneId = '1';
      const mockAeroplaneData = {
        id: mockAeroplaneId,
        name: 'Aeroplane 1',
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockGetAeroplaneById.mockResolvedValue(mockAeroplaneData);

      const result = await aeroplaneServices.getAeroplaneById(mockAeroplaneId);

      expect(mockGetAeroplaneById).toHaveBeenCalledWith(mockAeroplaneId);
      expect(result).toEqual(mockAeroplaneData);
    });
  });

  describe('getAeroplaneByName', () => {
    it('should get an aeroplane by name', async () => {
      const mockAeroplaneName = 'Aeroplane 1';
      const mockAeroplaneData = {
        id: '1',
        name: mockAeroplaneName,
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockgetAeroplaneByName.mockResolvedValue(mockAeroplaneData);

      const result =
        await aeroplaneServices.getAeroplaneByName(mockAeroplaneName);

      expect(mockgetAeroplaneByName).toHaveBeenCalledWith(mockAeroplaneName);
      expect(result).toEqual(mockAeroplaneData);
    });
  });

  describe('getAeroplaneByCode', () => {
    it('should get an aeroplane by code', async () => {
      const mockAeroplaneCode = 'A1';
      const mockAeroplaneData = {
        id: '1',
        name: 'Aeroplane 1',
        code: mockAeroplaneCode,
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      mockGetAeroplaneByCode.mockResolvedValue(mockAeroplaneData);

      const result =
        await aeroplaneServices.getAeroplaneByCode(mockAeroplaneCode);

      expect(mockGetAeroplaneByCode).toHaveBeenCalledWith(mockAeroplaneCode);
      expect(result).toEqual(mockAeroplaneData);
    });
  });

  describe('updateAeroplaneById', () => {
    it('should update an aeroplane by id', async () => {
      const mockAeroplaneId = '1';
      const payload = {
        name: 'Aeroplane 1',
        code: 'A1',
        type: 'Type 1',
        maxRow: 10,
        maxColumn: 5
      };

      const mockAeroplaneData = {
        id: mockAeroplaneId,
        name: 'Aeroplane 2',
        code: 'A2'
      };

      mockUpdateAeroplaneById.mockResolvedValue(mockAeroplaneData);

      const result = await aeroplaneServices.updateAeroplaneById(
        mockAeroplaneId,
        payload
      );

      expect(mockUpdateAeroplaneById).toHaveBeenCalledWith(
        mockAeroplaneId,
        payload
      );
      expect(result).toEqual(mockAeroplaneData);
    });
  });

  describe('deleteAeroplaneById', () => {
    it('should delete an aeroplane by id', async () => {
      const mockAeroplaneId = '1';

      mockDeleteAeroplaneById.mockResolvedValue(mockAeroplaneId);

      const result =
        await aeroplaneServices.deleteAeroplaneById(mockAeroplaneId);

      expect(mockDeleteAeroplaneById).toHaveBeenCalledWith(mockAeroplaneId);
      expect(result).toEqual(mockAeroplaneId);
    });
  });

  describe('getAllAeroplanes', () => {
    it('should get all aeroplanes', async () => {
      const mockAeroplaneData = [
        {
          id: '1',
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        },
        {
          id: '2',
          name: 'Aeroplane 2',
          code: 'A2',
          type: 'Type 2',
          maxRow: 20,
          maxColumn: 10
        }
      ];

      mockGetAllAeroplanes.mockResolvedValue(mockAeroplaneData);

      const result = await aeroplaneServices.getAllAeroplanes();

      expect(mockGetAllAeroplanes).toHaveBeenCalled();
      expect(result).toEqual(mockAeroplaneData);
    });
  });
});
