import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { HttpError } from '../../../utils/error.js';

jest.unstable_mockModule('../../../utils/helper.js', () => {
  return {
    generateJoiError: jest.fn()
  };
});

const flightValidation = await import('../flight.js');
const { generateJoiError } = await import('../../../utils/helper.js');

describe('Flight Validation', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  const next = jest.fn();

  describe('create flight validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
      const req = {
        body: {
          departureDate: '12-30-2024',
          arrivalDate: '01-01-2025',
          arrivalTime: '08.00',
          departureTime: '09.00',
          price: 1000,
          class: 'ECONOMY',
          description: 'Flight from Singapore to Jakarta',
          airlineId: '0193d538-641c-78c1-b7fa-93345d8ee7b7',
          airportIdFrom: '0193d538-6412-7183-a76f-cfc9cbefc417',
          airportIdTo: '0193d538-6415-7542-afc8-beb0536964df',
          aeroplaneId: '0193d538-642b-76f1-ba91-6b274fd78c2b',
          duration: 100
        }
      };

      await flightValidation.createFlightValidation(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message if validation fails', async () => {
      const req = {
        body: {
          departureDate: '',
          arrivalDate: '',
          arrivalTime: '',
          departureTime: '',
          price: '',
          class: '',
          description: '',
          airlineId: '',
          airportIdFrom: '',
          airportIdTo: '',
          aeroplaneId: '',
          duration: ''
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await flightValidation.createFlightValidation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });

    it('should throw HttpError if departureDate is after arrivalDate', async () => {
      const req = {
        body: {
          departureDate: '01-02-2025',
          arrivalDate: '01-01-2025',
          arrivalTime: '08.00',
          departureTime: '09.00',
          price: 1000,
          class: 'ECONOMY',
          description: 'Flight from Singapore to Jakarta',
          airlineId: '0193d538-641c-78c1-b7fa-93345d8ee7b7',
          airportIdFrom: '0193d538-6412-7183-a76f-cfc9cbefc417',
          airportIdTo: '0193d538-6415-7542-afc8-beb0536964df',
          aeroplaneId: '0193d538-642b-76f1-ba91-6b274fd78c2b',
          duration: 100
        }
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      const next = jest.fn();

      await flightValidation.createFlightValidation(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new HttpError('Departure date must be before arrival date', 400)
      );
    });

    it('should throw HttpError if departureDate is in the past', async () => {
      const req = {
        body: {
          departureDate: '01-01-2023',
          arrivalDate: '01-02-2025',
          arrivalTime: '08.00',
          departureTime: '09.00',
          price: 1000,
          class: 'ECONOMY',
          description: 'Flight from Singapore to Jakarta',
          airlineId: '0193d538-641c-78c1-b7fa-93345d8ee7b7',
          airportIdFrom: '0193d538-6412-7183-a76f-cfc9cbefc417',
          airportIdTo: '0193d538-6415-7542-afc8-beb0536964df',
          aeroplaneId: '0193d538-642b-76f1-ba91-6b274fd78c2b',
          duration: 100
        }
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      const next = jest.fn();

      await flightValidation.createFlightValidation(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new HttpError('Departure date must be in the future', 400)
      );
    });
  });

  describe('validateFilterSortingAndPageParams', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next and populate res.locals with valid filter, sort, and page params', async () => {
      const req = {
        query: {
          page: '2',
          class: 'ECONOMY',
          departureDate: '2024-12-25',
          arrivalDate: '2024-12-26',
          airportIdFrom: '0193d538-6412-7183-a76f-cfc9cbefc417',
          airportIdTo: '0193d538-6415-7542-afc8-beb0536964df',
          sortBy: 'price',
          sortOrder: 'asc',
          airlineIds:
            '0193d538-6412-7183-a76f-cfc9cbefc417,0193d538-6415-7542-afc8-beb0536964df'
        }
      };

      const res = {
        locals: {},
        status: jest.fn(() => res),
        json: jest.fn()
      };

      const next = jest.fn();

      await flightValidation.validateFilterSortingAndPageParams(req, res, next);

      expect(res.locals.page).toBe(2);
      expect(res.locals.filter).toEqual({
        class: 'ECONOMY',
        airportIdFrom: '0193d538-6412-7183-a76f-cfc9cbefc417',
        airportIdTo: '0193d538-6415-7542-afc8-beb0536964df',
        departureDate: {
          gte: expect.any(Date),
          lte: expect.any(Date)
        },
        arrivalDate: {
          gte: expect.any(Date),
          lte: expect.any(Date)
        },
        airlineId: {
          in: [
            '0193d538-6412-7183-a76f-cfc9cbefc417',
            '0193d538-6415-7542-afc8-beb0536964df'
          ]
        }
      });
      expect(res.locals.sort).toEqual({ price: 'asc' });
      expect(res.locals.favourite).toBe(false);
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if query parameters are invalid', async () => {
      const req = {
        query: {
          page: '-1',
          sortBy: 'invalid_field',
          sortOrder: 'wrong_value'
        }
      };

      const error = new Error('Validation error');
      generateJoiError.mockReturnValue(error);

      const res = {
        locals: {},
        status: jest.fn(() => res),
        json: jest.fn()
      };

      const next = jest.fn();

      await flightValidation.validateFilterSortingAndPageParams(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing query parameters gracefully', async () => {
      const req = {
        query: {}
      };

      const res = {
        locals: {},
        status: jest.fn(() => res),
        json: jest.fn()
      };

      const next = jest.fn();

      await flightValidation.validateFilterSortingAndPageParams(req, res, next);

      expect(res.locals.page).toBe(1);
      expect(res.locals.filter).toEqual({});
      expect(res.locals.sort).toEqual({});
      expect(res.locals.favourite).toBe(false);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateReturnFlightId', () => {
    it('should call next with valid returnFlightId', async () => {
      const req = {
        query: {
          returnFlightId: '0193d538-6412-7183-a76f-cfc9cbefc417'
        }
      };

      await flightValidation.validateReturnFlightId(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if returnFlightId is invalid', async () => {
      const req = {
        query: {
          returnFlightId: 'invalid-uuid'
        }
      };

      const error = new Error('Validation error');

      generateJoiError.mockReturnValue(error);

      await flightValidation.validateReturnFlightId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
