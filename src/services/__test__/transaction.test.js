import { describe, expect, it, jest } from '@jest/globals';

const mockPrismaTransaction = jest.fn();
jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    $transaction: mockPrismaTransaction
  }
}));

const mockCalculateAmount = jest.fn();
jest.unstable_mockModule('../../utils/helper.js', () => ({
  calculateAmount: mockCalculateAmount
}));

import { HttpError } from '../../utils/error.js';

const mockSendEmail = jest.fn();
jest.unstable_mockModule('../../utils/email/mail.js', () => ({
  sendEmail: mockSendEmail
}));

const mockCancelMidtransTransaction = jest.fn();
jest.unstable_mockModule('../../utils/midtrans.js', () => ({
  cancelMidtransTransaction: mockCancelMidtransTransaction
}));

const mockUpdateSeatStatusBySeats = jest.fn();
jest.unstable_mockModule('../../repositories/seat.js', () => ({
  updateSeatStatusBySeats: mockUpdateSeatStatusBySeats
}));

const mockGetFlightWithSeatsById = jest.fn();
jest.unstable_mockModule('../../services/flight.js', () => ({
  getFlightWithSeatsById: mockGetFlightWithSeatsById
}));

const mockCreateMidtransToken = jest.fn();
jest.unstable_mockModule('../../services/payment.js', () => ({
  createMidtransToken: mockCreateMidtransToken
}));

const mockCreatePayment = jest.fn();
const mockGetExpiredPaymentWithFlightAndPassenger = jest.fn();
const mockCancelAllPaymentByIds = jest.fn();
jest.unstable_mockModule('../../repositories/payment.js', () => ({
  createPayment: mockCreatePayment,
  getExpiredPaymentWithFlightAndPassenger:
    mockGetExpiredPaymentWithFlightAndPassenger,
  cancelAllPaymentByIds: mockCancelAllPaymentByIds
}));

const mockGetActiveTransaction = jest.fn();
const mockCreateTransactionAndPassenger = jest.fn();
const mockGetDetailTransactionById = jest.fn();
const mockGetAllTransactions = jest.fn();
const mockGetTransactionWithFlightAndPassenger = jest.fn();
const mockCountFlightDataWithFilter = jest.fn();
const mockCountTransactionDataWithFilter = jest.fn();
const mockGetTransactionWithUserAndPaymentById = jest.fn();
jest.unstable_mockModule('../../repositories/transaction.js', () => ({
  getActiveTransaction: mockGetActiveTransaction,
  createTransactionAndPassenger: mockCreateTransactionAndPassenger,
  getDetailTransactionById: mockGetDetailTransactionById,
  getAllTransactions: mockGetAllTransactions,
  getTransactionWithFlightAndPassenger:
    mockGetTransactionWithFlightAndPassenger,
  countFlightDataWithFilter: mockCountFlightDataWithFilter,
  countTransactionDataWithFilter: mockCountTransactionDataWithFilter,
  getTransactionWithUserAndPaymentById: mockGetTransactionWithUserAndPaymentById
}));

const transactionServices = await import('../transaction.js');

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('createTransaction', () => {
    it('should throw an error if user has an active transaction', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce({ id: '1' });

      const payload = { userId: '1', departureFlightId: '101' };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(
        new HttpError('User already has an active transaction', 400)
      );
    });

    it('should throw an error if departure flight is not found', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById.mockResolvedValueOnce(null);

      const payload = { userId: '1', departureFlightId: '101' };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(new HttpError('Departure Flight not found', 404));
    });

    it('should throw an error if return flight is not found', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById
        .mockResolvedValueOnce({
          id: '101',
          airportIdFrom: '1',
          airportIdTo: '2'
        })
        .mockResolvedValueOnce(null);

      const payload = {
        userId: '1',
        departureFlightId: '101',
        returnFlightId: '202'
      };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(new HttpError('Return Flight not found', 404));
    });

    it('should throw an error if return flight does not match departure flight', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById
        .mockResolvedValueOnce({
          id: '101',
          airportIdFrom: '1',
          airportIdTo: '2'
        })
        .mockResolvedValueOnce({
          id: '202',
          airportIdFrom: '3',
          airportIdTo: '4'
        });

      const payload = {
        userId: '1',
        departureFlightId: '101',
        returnFlightId: '202'
      };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(
        new HttpError(
          'Return flight must be the opposite of departure flight',
          400
        )
      );
    });

    it('should throw an error if departure date is in the past', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById.mockResolvedValueOnce({
        id: '101',
        departureDate: '2023-01-01',
        airportIdFrom: '1',
        airportIdTo: '2'
      });

      const payload = { userId: '1', departureFlightId: '101' };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(
        new HttpError('Departure flight date cannot be in the past', 400)
      );
    });

    it('should throw an error if return flight date is earlier than departure flight date', async () => {
      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById
        .mockResolvedValueOnce({
          id: '101',
          departureDate: '2024-12-25',
          arrivalDate: '2024-12-26',
          airportIdFrom: '1',
          airportIdTo: '2'
        })
        .mockResolvedValueOnce({
          id: '202',
          departureDate: '2024-12-24',
          arrivalDate: '2024-12-25',
          airportIdFrom: '2',
          airportIdTo: '1'
        });

      const payload = {
        userId: '1',
        departureFlightId: '101',
        returnFlightId: '202'
      };
      await expect(
        transactionServices.createTransaction(payload)
      ).rejects.toThrow(
        new HttpError(
          'Return flight date cannot be earlier than departure flight date',
          400
        )
      );
    });

    it('should set returnPrice to 0 when returnFlight is not provided', async () => {
      const validDepartureFlight = {
        id: '101',
        departureDate: '2024-12-25',
        arrivalDate: '2024-12-26',
        airportIdFrom: '1',
        airportIdTo: '2',
        price: 100000,
        seat: [{ id: 'D1', status: 'AVAILABLE' }]
      };

      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById.mockResolvedValueOnce(validDepartureFlight);

      const payload = {
        userId: '1',
        departureFlightId: '101',
        passengers: [
          { departureSeatId: 'D1', returnSeatId: null, type: 'ADULT' }
        ]
      };

      await transactionServices.createTransaction(payload);
    });

    it('should create transaction successfully with valid payload', async () => {
      const validDepartureFlight = {
        id: '101',
        departureDate: '2024-12-25',
        arrivalDate: '2024-12-26',
        airportIdFrom: '1',
        airportIdTo: '2',
        price: 100000,
        seat: [{ id: 'D1', status: 'AVAILABLE' }]
      };

      const validReturnFlight = {
        id: '202',
        departureDate: '2024-12-27',
        arrivalDate: '2024-12-28',
        airportIdFrom: '2',
        airportIdTo: '1',
        price: 80000,
        seat: [{ id: 'R1', status: 'AVAILABLE' }]
      };

      mockGetActiveTransaction.mockResolvedValueOnce(null);
      mockGetFlightWithSeatsById
        .mockResolvedValueOnce(validDepartureFlight)
        .mockResolvedValueOnce(validReturnFlight);

      mockCalculateAmount.mockReturnValueOnce(200000);
      mockPrismaTransaction.mockImplementationOnce(async (fn) => fn());

      mockCreateTransactionAndPassenger.mockResolvedValueOnce({ id: '1' });
      mockCreateMidtransToken.mockResolvedValueOnce({ token: 'abc123' });
      mockCreatePayment.mockResolvedValueOnce({ id: '10' });

      const payload = {
        userId: '1',
        departureFlightId: '101',
        returnFlightId: '202',
        passengers: [
          { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' }
        ]
      };

      const result = await transactionServices.createTransaction(payload);
      expect(result).toEqual({
        id: '1',
        payment: { id: '10' }
      });
    });
  });

  describe('getDetailTransactionById', () => {
    it('should throw an error if transaction is not found', async () => {
      mockGetDetailTransactionById.mockResolvedValueOnce(null);

      const id = '1';
      const userId = '1';
      await expect(
        transactionServices.getDetailTransactionById(id, userId)
      ).rejects.toThrow(new HttpError('Transaction not found', 404));
    });

    it('should throw an error if user is unauthorized', async () => {
      mockGetDetailTransactionById.mockResolvedValueOnce({ userId: '2' });

      const id = '1';
      const userId = '1';
      await expect(
        transactionServices.getDetailTransactionById(id, userId)
      ).rejects.toThrow(new HttpError('Unauthorized', 403));
    });

    it('should handle transactions without return flight', async () => {
      const transactionData = {
        userId: '1',
        departureFlight: { price: 100000 },
        returnFlight: null,
        passenger: [{ id: '1' }]
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);
      mockCalculateAmount.mockReturnValueOnce(100000);

      const id = '1';
      const userId = '1';
      const result = await transactionServices.getDetailTransactionById(
        id,
        userId
      );

      expect(result).toEqual({
        ...transactionData,
        tax: 10000
      });
    });

    it('should handle transactions with no passengers', async () => {
      const transactionData = {
        userId: '1',
        departureFlight: { price: 100000 },
        returnFlight: { price: 80000, id: '202' },
        passenger: []
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);
      mockCalculateAmount.mockReturnValueOnce(0);

      const id = '1';
      const userId = '1';
      const result = await transactionServices.getDetailTransactionById(
        id,
        userId
      );

      expect(result).toEqual({
        ...transactionData,
        tax: 0
      });
    });

    it('should return transaction details with tax', async () => {
      const transactionData = {
        userId: '1',
        departureFlight: { price: 100000 },
        returnFlight: { price: 80000, id: '202' },
        passenger: [{ id: '1' }]
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);
      mockCalculateAmount.mockReturnValueOnce(180000);

      const id = '1';
      const userId = '1';
      const result = await transactionServices.getDetailTransactionById(
        id,
        userId
      );

      expect(result).toEqual({
        ...transactionData,
        tax: 0
      });
    });
  });

  describe('getAllTransactions', () => {
    it('should return transactions with complex filter', async () => {
      const transactions = [{ id: '1' }, { id: '2' }];
      mockGetAllTransactions.mockResolvedValueOnce(transactions);

      const userId = '1';
      const filter = { status: ['PAID', 'CANCELLED'] };
      const meta = { skip: 0, limit: 10 };

      const result = await transactionServices.getAllTransactions(
        userId,
        filter,
        meta
      );
      expect(result).toEqual(transactions);
    });

    it('should handle meta not provided', async () => {
      const transactions = [{ id: '1' }];
      mockGetAllTransactions.mockResolvedValueOnce(transactions);

      const userId = '1';
      const filter = { status: 'PENDING' };

      const result = await transactionServices.getAllTransactions(
        userId,
        filter,
        {}
      );
      expect(result).toEqual(transactions);
    });

    it('should return empty array when no transactions found', async () => {
      mockGetAllTransactions.mockResolvedValueOnce([]);

      const userId = '1';
      const filter = {};
      const meta = { skip: 0, limit: 10 };

      const result = await transactionServices.getAllTransactions(
        userId,
        filter,
        meta
      );
      expect(result).toEqual([]);
    });
  });

  describe('getTransactionWithFlightAndPassenger', () => {
    it('should throw an error if transaction is not found', async () => {
      mockGetDetailTransactionById.mockResolvedValueOnce(null);

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      await expect(
        transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        )
      ).rejects.toThrow(new HttpError('Transaction not found', 404));
    });

    it('should throw an error if user is unauthorized', async () => {
      mockGetDetailTransactionById.mockResolvedValueOnce({
        userId: '2',
        payment: { status: 'SUCCESS' },
        departureFlight: {},
        returnFlight: {},
        passenger: []
      });

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      await expect(
        transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        )
      ).rejects.toThrow(new HttpError('Unauthorized', 403));
    });

    it('should throw an error if transaction payment is not successful', async () => {
      mockGetDetailTransactionById.mockResolvedValueOnce({
        userId: '1',
        payment: { status: 'PENDING' },
        departureFlight: {},
        returnFlight: {},
        passenger: []
      });

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      await expect(
        transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        )
      ).rejects.toThrow(
        new HttpError('Transaction incomplete cannot send e-ticket', 400)
      );
    });

    it('should send e-ticket email and return transaction', async () => {
      const transactionData = {
        userId: '1',
        payment: { status: 'SUCCESS' },
        departureFlight: {
          airline: { name: 'Airline', code: 'AL' },
          aeroplane: { name: 'Plane' },
          class: 'Economy',
          departureDate: new Date('2024-12-25'),
          departureTime: '10:00',
          arrivalTime: '12:00',
          duration: '2h',
          airportFrom: { city: 'CityA', code: 'CTA', name: 'AirportA' },
          airportTo: { city: 'CityB', code: 'CTB', name: 'AirportB' }
        },
        returnFlight: {
          airline: { name: 'Airline', code: 'AL' },
          aeroplane: { name: 'Plane' },
          class: 'Economy',
          departureDate: new Date('2024-12-27'),
          departureTime: '14:00',
          arrivalTime: '16:00',
          duration: '2h',
          airportFrom: { city: 'CityB', code: 'CTB', name: 'AirportB' },
          airportTo: { city: 'CityA', code: 'CTA', name: 'AirportA' }
        },
        passenger: [
          {
            title: 'Tuan.',
            firstName: 'John',
            familyName: 'Doe',
            type: 'Dewasa'
          },
          { title: 'Nona.', firstName: 'Jane', familyName: '', type: 'Anak' }
        ]
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      const result =
        await transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        );

      const expectedTicket = {
        departureAirline: 'Airline (AL)',
        departureAeroplane: 'Plane',
        departureClass: 'Economy',
        departureDate: 'Rabu, 25 Desember 2024',
        departureTime: '10:00',
        arrivalTime: '12:00',
        duration: '2h',
        departureAirportFromCity: 'CityA',
        arrivalAirportToCity: 'CityB',
        departureAirportFromCode: 'CTA',
        arrivalAirportToCode: 'CTB',
        departureAirportFromName: 'AirportA',
        arrivalAirportToName: 'AirportB',
        returnFlight: {
          returnAirline: 'Airline (AL)',
          returnAeroplane: 'Plane',
          returnClass: 'Economy',
          returnDate: 'Jumat, 27 Desember 2024',
          returnDepartureTime: '14:00',
          returnArrivalTime: '16:00',
          returnDuration: '2h',
          returnairportFromCity: 'CityB',
          returnairportToCity: 'CityA',
          returnairportFromCode: 'CTB',
          returnairportToCode: 'CTA',
          returnairportFromName: 'AirportB',
          returnairportToName: 'AirportA'
        },
        passengers: [
          {
            title: 'Tuan.',
            firstName: 'John',
            familyName: 'Doe',
            type: 'Dewasa'
          },
          { title: 'Nona.', firstName: 'Jane', familyName: '', type: 'Anak' }
        ]
      };

      expect(mockSendEmail).toHaveBeenCalledWith(
        email,
        'Tiket Pesawat Kamu',
        'ticket',
        { ticket: expectedTicket }
      );
      expect(result).toEqual(transactionData);
    });

    it('should send e-ticket email without return flight when return flight is null', async () => {
      const transactionData = {
        userId: '1',
        payment: { status: 'SUCCESS' },
        departureFlight: {
          airline: { name: 'Airline', code: 'AL' },
          aeroplane: { name: 'Plane' },
          class: 'Economy',
          departureDate: new Date('2024-12-25'),
          departureTime: '10:00',
          arrivalTime: '12:00',
          duration: '2h',
          airportFrom: { city: 'CityA', code: 'CTA', name: 'AirportA' },
          airportTo: { city: 'CityB', code: 'CTB', name: 'AirportB' }
        },
        returnFlight: null,
        passenger: [
          {
            title: 'Tuan.',
            firstName: 'John',
            familyName: 'Doe',
            type: 'Dewasa'
          },
          { title: 'Nona.', firstName: 'Jane', familyName: '', type: 'Anak' }
        ]
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      const result =
        await transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        );

      const expectedTicket = {
        departureAirline: 'Airline (AL)',
        departureAeroplane: 'Plane',
        departureClass: 'Economy',
        departureDate: 'Rabu, 25 Desember 2024',
        departureTime: '10:00',
        arrivalTime: '12:00',
        duration: '2h',
        departureAirportFromCity: 'CityA',
        arrivalAirportToCity: 'CityB',
        departureAirportFromCode: 'CTA',
        arrivalAirportToCode: 'CTB',
        departureAirportFromName: 'AirportA',
        arrivalAirportToName: 'AirportB',
        returnFlight: null,
        passengers: [
          {
            title: 'Tuan.',
            firstName: 'John',
            familyName: 'Doe',
            type: 'Dewasa'
          },
          { title: 'Nona.', firstName: 'Jane', familyName: '', type: 'Anak' }
        ]
      };

      expect(mockSendEmail).toHaveBeenCalledWith(
        email,
        'Tiket Pesawat Kamu',
        'ticket',
        { ticket: expectedTicket }
      );
      expect(result).toEqual(transactionData);
    });

    it('should set title to empty string for passengers with type CHILD or INFANT', async () => {
      const transactionData = {
        userId: '1',
        payment: { status: 'SUCCESS' },
        departureFlight: {
          airline: { name: 'Airline', code: 'AL' },
          aeroplane: { name: 'Plane' },
          class: 'Economy',
          departureDate: new Date('2024-12-25'),
          departureTime: '10:00',
          arrivalTime: '12:00',
          duration: '2h',
          airportFrom: { city: 'CityA', code: 'CTA', name: 'AirportA' },
          airportTo: { city: 'CityB', code: 'CTB', name: 'AirportB' }
        },
        returnFlight: null,
        passenger: [
          {
            title: 'Tuan.',
            firstName: 'John',
            familyName: 'Doe',
            type: 'Dewasa'
          },
          { title: 'Nona.', firstName: 'Jane', familyName: '', type: 'CHILD' },
          {
            title: 'Tuan.',
            firstName: 'Baby',
            familyName: 'Doe',
            type: 'INFANT'
          }
        ]
      };

      mockGetDetailTransactionById.mockResolvedValueOnce(transactionData);

      const id = '1';
      const userId = '1';
      const email = 'test@example.com';
      const result =
        await transactionServices.getTransactionWithFlightAndPassenger(
          id,
          userId,
          email
        );

      expect(result).toEqual(transactionData);
      expect(result).toEqual(transactionData);
    });
  });

  describe('cancelTransaction', () => {
    it('should throw an error if transaction is not found', async () => {
      mockGetTransactionWithUserAndPaymentById.mockResolvedValueOnce(null);

      const id = '1';
      const userId = '1';
      await expect(
        transactionServices.cancelTransaction(id, userId)
      ).rejects.toThrow(new HttpError('Transaction not found', 404));
    });

    it('should throw an error if user is unauthorized', async () => {
      mockGetTransactionWithUserAndPaymentById.mockResolvedValueOnce({
        userId: '2'
      });

      const id = '1';
      const userId = '1';
      await expect(
        transactionServices.cancelTransaction(id, userId)
      ).rejects.toThrow(new HttpError('Unauthorized', 403));
    });

    it('should throw an error if transaction cannot be canceled', async () => {
      mockGetTransactionWithUserAndPaymentById.mockResolvedValueOnce({
        userId: '1',
        payment: { status: 'SUCCESS', method: 'credit_card' }
      });

      const id = '1';
      const userId = '1';
      await expect(
        transactionServices.cancelTransaction(id, userId)
      ).rejects.toThrow(new HttpError('Transaction cannot be canceled', 400));
    });

    it('should cancel transaction successfully', async () => {
      mockGetTransactionWithUserAndPaymentById.mockResolvedValueOnce({
        id: '1',
        userId: '1',
        payment: { status: 'PENDING', method: 'credit_card' }
      });

      const id = '1';
      const userId = '1';
      mockCancelMidtransTransaction.mockResolvedValueOnce(id);
      await transactionServices.cancelTransaction(id, userId);

      expect(mockCancelMidtransTransaction).toHaveBeenCalledWith(id);
    });
  });

  describe('countTransactionDataWithFilterAndCreateMeta', () => {
    it('should throw an error if page is greater than total pages', async () => {
      mockCountTransactionDataWithFilter.mockResolvedValueOnce(5);

      const filter = {};
      const page = 2;
      await expect(
        transactionServices.countTransactionDataWithFilterAndCreateMeta(
          filter,
          page
        )
      ).rejects.toThrow(new HttpError('Page not found', 404));
    });

    it('should calculate total pages correctly when total data is provides', async () => {
      const filter = {};
      const page = 1;

      mockCountTransactionDataWithFilter.mockResolvedValue(0);
      const result =
        await transactionServices.countTransactionDataWithFilterAndCreateMeta(
          filter,
          page
        );

      expect(result.totalPage).toBe(1);
      expect(result.totalData).toBe(0);
    });

    it('should throw "Page not found" if page is greater than totalPage', async () => {
      const filter = {};
      const page = 2;

      mockCountTransactionDataWithFilter.mockResolvedValueOnce(5);

      await expect(
        transactionServices.countTransactionDataWithFilterAndCreateMeta(
          filter,
          page
        )
      ).rejects.toThrowError(new HttpError('Page not found', 404));
    });

    it('should return meta data with total pages and skip value', async () => {
      mockCountTransactionDataWithFilter.mockResolvedValueOnce(25);

      const filter = {};
      const page = 2;
      const result =
        await transactionServices.countTransactionDataWithFilterAndCreateMeta(
          filter,
          page
        );

      expect(result).toEqual({
        page: 2,
        limit: 10,
        totalPage: 3,
        totalData: 25,
        skip: 10
      });
    });
  });

  describe('validatePassengers', () => {
    it('should throw an error if departure seat is not found', async () => {
      const passengers = [{ departureSeatId: 'D1', type: 'ADULT' }];
      const departureSeats = [{ id: 'D2', status: 'AVAILABLE' }];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          null,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError('Departure seat for passenger number 1 not found', 400)
      );
    });

    it('should throw an error if departure seat is already booked', async () => {
      const passengers = [{ departureSeatId: 'D1', type: 'ADULT' }];
      const departureSeats = [{ id: 'D1', status: 'BOOKED' }];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          null,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError(
          'Departure seat for passenger number 1 is already booked',
          400
        )
      );
    });

    it('should throw an error if departure seat ID is not unique', async () => {
      const passengers = [
        { departureSeatId: 'D1', type: 'ADULT' },
        { departureSeatId: 'D1', type: 'ADULT' }
      ];
      const departureSeats = [{ id: 'D1', status: 'AVAILABLE' }];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          null,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError(
          'Departure seat ID must be unique for all passengers',
          400
        )
      );
    });

    it('should throw an error if return flight seat is forbidden when returnSeatId is provided', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' }
      ];
      const departureSeats = [{ id: 'D1', status: 'AVAILABLE' }];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          false,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError(
          'Return flight seat for passenger number 1 forbidden',
          400
        )
      );
    });

    it('should throw an error if identity number is not unique', async () => {
      const passengers = [
        { departureSeatId: 'D1', identityNumber: '123', type: 'ADULT' },
        { departureSeatId: 'D2', identityNumber: '123', type: 'ADULT' }
      ];
      const departureSeats = [
        { id: 'D1', status: 'AVAILABLE' },
        { id: 'D2', status: 'AVAILABLE' }
      ];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          null,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError(
          'Identity number for passenger number 2 must be unique',
          400
        )
      );
    });

    it('should validate passengers successfully', async () => {
      const passengers = [
        {
          departureSeatId: 'D1',
          identityNumber: '123',
          type: 'ADULT',
          birthday: '1990-01-01',
          expiredAt: '2030-01-01'
        },
        {
          departureSeatId: 'D2',
          identityNumber: '456',
          type: 'ADULT',
          birthday: '1990-01-01',
          expiredAt: '2030-01-01'
        }
      ];
      const departureSeats = [
        { id: 'D1', status: 'AVAILABLE' },
        { id: 'D2', status: 'AVAILABLE' }
      ];
      const returnSeats = [];

      const result = await transactionServices.validatePassengers(
        passengers,
        null,
        departureSeats,
        returnSeats
      );

      expect(result).toEqual({
        seatIds: ['D1', 'D2'],
        proccessedPassengers: [
          {
            ...passengers[0],
            birthday: new Date(passengers[0].birthday),
            expiredAt: new Date(passengers[0].expiredAt)
          },
          {
            ...passengers[1],
            birthday: new Date(passengers[1].birthday),
            expiredAt: new Date(passengers[1].expiredAt)
          }
        ]
      });
    });

    it('should validate passengers with return flight successfully', async () => {
      const passengers = [
        {
          departureSeatId: 'D1',
          returnSeatId: 'R1',
          identityNumber: '123',
          type: 'ADULT',
          birthday: '1990-01-01',
          expiredAt: '2030-01-01'
        },
        {
          departureSeatId: 'D2',
          returnSeatId: 'R2',
          identityNumber: '456',
          type: 'ADULT',
          birthday: '1990-01-01',
          expiredAt: '2030-01-01'
        }
      ];
      const departureSeats = [
        { id: 'D1', status: 'AVAILABLE' },
        { id: 'D2', status: 'AVAILABLE' }
      ];
      const returnSeats = [
        { id: 'R1', status: 'AVAILABLE' },
        { id: 'R2', status: 'AVAILABLE' }
      ];

      const result = await transactionServices.validatePassengers(
        passengers,
        true,
        departureSeats,
        returnSeats
      );

      expect(result).toEqual({
        seatIds: ['D1', 'D2', 'R1', 'R2'],
        proccessedPassengers: [
          {
            ...passengers[0],
            birthday: new Date(passengers[0].birthday),
            expiredAt: new Date(passengers[0].expiredAt)
          },
          {
            ...passengers[1],
            birthday: new Date(passengers[1].birthday),
            expiredAt: new Date(passengers[1].expiredAt)
          }
        ]
      });
    });

    it('should throw an error if return seat is not found for return flight', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' }
      ];
      const departureSeats = [{ id: 'D1', status: 'AVAILABLE' }];
      const returnSeats = [];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          true,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError('Return seat for passenger number 1 not found', 400)
      );
    });

    it('should throw an error if return seat is not available for return flight', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' }
      ];
      const departureSeats = [{ id: 'D1', status: 'AVAILABLE' }];
      const returnSeats = [{ id: 'R1', status: 'BOOKED' }];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          true,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError(
          'Return seat for passenger number 1 is already booked',
          400
        )
      );
    });

    it('should check return seat ID for passengers who are not infants', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' },
        { departureSeatId: 'D2', returnSeatId: 'R2', type: 'CHILD' }
      ];
      const departureSeats = [
        { id: 'D1', status: 'AVAILABLE' },
        { id: 'D2', status: 'AVAILABLE' }
      ];
      const returnSeats = [
        { id: 'R1', status: 'AVAILABLE' },
        { id: 'R2', status: 'AVAILABLE' }
      ];

      const result = await transactionServices.validatePassengers(
        passengers,
        true,
        departureSeats,
        returnSeats
      );

      expect(result.seatIds).toEqual(['D1', 'D2', 'R1', 'R2']);
      expect(result.proccessedPassengers).toEqual([
        {
          ...passengers[0],
          birthday: expect.anything(),
          expiredAt: expect.anything()
        },
        {
          ...passengers[1],
          birthday: expect.anything(),
          expiredAt: expect.anything()
        }
      ]);
    });

    it('should skip return seat validation for infant passengers', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'INFANT' }
      ];
      const departureSeats = [{ id: 'D1', status: 'AVAILABLE' }];
      const returnSeats = [{ id: 'R1', status: 'AVAILABLE' }];

      const result = await transactionServices.validatePassengers(
        passengers,
        true,
        departureSeats,
        returnSeats
      );

      expect(result.seatIds).toEqual([]);
      expect(result.proccessedPassengers).toEqual([
        {
          ...passengers[0],
          birthday: expect.anything(),
          expiredAt: expect.anything()
        }
      ]);
    });

    it('should throw an error if return seat ID is not unique for return flight', async () => {
      const passengers = [
        { departureSeatId: 'D1', returnSeatId: 'R1', type: 'ADULT' },
        { departureSeatId: 'D2', returnSeatId: 'R1', type: 'ADULT' }
      ];
      const departureSeats = [
        { id: 'D1', status: 'AVAILABLE' },
        { id: 'D2', status: 'AVAILABLE' }
      ];
      const returnSeats = [{ id: 'R1', status: 'AVAILABLE' }];

      await expect(
        transactionServices.validatePassengers(
          passengers,
          true,
          departureSeats,
          returnSeats
        )
      ).rejects.toThrow(
        new HttpError('Return seat ID must be unique for all passengers', 400)
      );
    });
  });

  describe('invalidateExpiredTransactions', () => {
    it('should update seat status and cancel payments for expired transactions', async () => {
      const payments = [
        {
          id: '1',
          transaction: {
            passenger: [
              { departureSeatId: 'D1', returnSeatId: 'R1' },
              { departureSeatId: 'D2', returnSeatId: 'R2' }
            ]
          }
        },
        {
          id: '2',
          transaction: {
            passenger: [{ departureSeatId: 'D3', returnSeatId: null }]
          }
        }
      ];

      const mockTransaction = {};
      mockGetExpiredPaymentWithFlightAndPassenger.mockResolvedValueOnce(
        payments
      );
      mockPrismaTransaction.mockImplementationOnce(async (fn) =>
        fn(mockTransaction)
      );

      await transactionServices.invalidateExpiredTransactions();

      expect(mockGetExpiredPaymentWithFlightAndPassenger).toHaveBeenCalled();
      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        ['D1', 'R1', 'D2', 'R2', 'D3'],
        'AVAILABLE',
        mockTransaction
      );
      expect(mockCancelAllPaymentByIds).toHaveBeenCalledWith(
        ['1', '2'],
        mockTransaction
      );
    });

    it('should collect departureSeatId for each passenger', async () => {
      const payments = [
        {
          id: '1',
          transaction: {
            passenger: [
              { departureSeatId: 'D1', returnSeatId: 'R1' },
              { departureSeatId: 'D2', returnSeatId: 'R2' }
            ]
          }
        },
        {
          id: '2',
          transaction: {
            passenger: [{ departureSeatId: 'D3', returnSeatId: null }]
          }
        }
      ];

      const mockTransaction = {};
      mockGetExpiredPaymentWithFlightAndPassenger.mockResolvedValueOnce(
        payments
      );
      mockPrismaTransaction.mockImplementationOnce(async (fn) =>
        fn(mockTransaction)
      );

      await transactionServices.invalidateExpiredTransactions();

      expect(mockGetExpiredPaymentWithFlightAndPassenger).toHaveBeenCalled();
      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        ['D1', 'R1', 'D2', 'R2', 'D3'],
        'AVAILABLE',
        mockTransaction
      );
    });

    it('should not collect departureSeatId if it is null', async () => {
      const payments = [
        {
          id: '1',
          transaction: {
            passenger: [
              { departureSeatId: null, returnSeatId: 'R1' },
              { departureSeatId: 'D2', returnSeatId: 'R2' }
            ]
          }
        }
      ];

      const mockTransaction = {};
      mockGetExpiredPaymentWithFlightAndPassenger.mockResolvedValueOnce(
        payments
      );
      mockPrismaTransaction.mockImplementationOnce(async (fn) =>
        fn(mockTransaction)
      );

      await transactionServices.invalidateExpiredTransactions();

      expect(mockGetExpiredPaymentWithFlightAndPassenger).toHaveBeenCalled();
      expect(mockUpdateSeatStatusBySeats).toHaveBeenCalledWith(
        ['R1', 'D2', 'R2'],
        'AVAILABLE',
        mockTransaction
      );
      expect(mockUpdateSeatStatusBySeats).not.toHaveBeenCalledWith(
        expect.arrayContaining([null]),
        'AVAILABLE',
        mockTransaction
      );
    });

    it('should not update seat status or cancel payments if no expired transactions', async () => {
      mockGetExpiredPaymentWithFlightAndPassenger.mockResolvedValueOnce([]);

      await transactionServices.invalidateExpiredTransactions();

      expect(mockGetExpiredPaymentWithFlightAndPassenger).toHaveBeenCalled();
      expect(mockUpdateSeatStatusBySeats).not.toHaveBeenCalled();
      expect(mockCancelAllPaymentByIds).not.toHaveBeenCalled();
    });
  });
});
