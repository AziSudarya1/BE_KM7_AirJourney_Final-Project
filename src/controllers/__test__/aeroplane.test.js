import { describe, expect, it, jest } from '@jest/globals';

const mockCreateAeroplane = jest.fn();
const mockGetAeroplaneById = jest.fn();
const mockUpdateAeroplaneById = jest.fn();
const mockDeleteAeroplaneById = jest.fn();
const mockGetAllAeroplanes = jest.fn();

jest.unstable_mockModule('../../services/aeroplane.js', () => ({
  createAeroplane: mockCreateAeroplane,
  getAeroplaneById: mockGetAeroplaneById,
  updateAeroplaneById: mockUpdateAeroplaneById,
  deleteAeroplaneById: mockDeleteAeroplaneById,
  getAllAeroplanes: mockGetAllAeroplanes
}));

const aeroplaneController = await import('../aeroplane.js');

describe('Aeroplane Controller', () => {
  describe('createAeroplane', () => {
    it('should create a new aeroplane', async () => {
      const mockRequest = {
        body: {
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const aeroplaneData = await aeroplaneController.createAeroplane(
        mockRequest,
        mockResponse
      );

      expect(mockCreateAeroplane).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'aeroplane created succesfully',
        data: aeroplaneData
      });
    });
  });

  describe('getAeroplaneById', () => {
    it('should get an aeroplane by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const aeroplaneData = await aeroplaneController.getAeroplaneById(
        mockRequest,
        mockResponse
      );

      expect(mockGetAeroplaneById).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Aeroplane retrieved by id successfully',
        data: aeroplaneData
      });
    });
  });

  describe('updateAeroplaneById', () => {
    it('should update an aeroplane by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        },
        body: {
          name: 'Aeroplane 1',
          code: 'A1',
          type: 'Type 1',
          maxRow: 10,
          maxColumn: 5
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const aeroplaneData = await aeroplaneController.updateAeroplane(
        mockRequest,
        mockResponse
      );

      expect(mockUpdateAeroplaneById).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Aeroplane updated succesfully',
        data: aeroplaneData
      });
    });
  });

  describe('deleteAeroplaneById', () => {
    it('should delete an aeroplane by id', async () => {
      const mockRequest = {
        params: {
          id: '1'
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await aeroplaneController.deleteAeroplane(mockRequest, mockResponse);

      expect(mockDeleteAeroplaneById).toHaveBeenCalledWith(
        mockRequest.params.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Aeroplane deleted succesfully'
      });
    });
  });

  describe('getAllAeroplanes', () => {
    it('should get all aeroplanes', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const aeroplanesData = await aeroplaneController.getAllAeroplanes(
        mockRequest,
        mockResponse
      );

      expect(mockGetAllAeroplanes).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'All aeroplanes retrieved successfully',
        data: aeroplanesData
      });
    });
  });
});
