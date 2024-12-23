import { describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    seat: {
      updateMany: jest.fn()
    }
  }
}));

const { prisma } = await import('../../utils/db.js');
const seatRepository = await import('../seat.js');

describe('Seat Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSeatStatusBySeats', () => {
    it('should update seat status by seats', async () => {
      const seats = ['1A', '1B', '1C'];
      const payload = { status: 'BOOKED' };

      await seatRepository.updateSeatStatusBySeats(seats, payload);

      expect(prisma.seat.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: seats
          }
        },
        data: {
          status: {
            status: payload.status
          }
        }
      });
      expect(prisma.seat.updateMany).toHaveBeenCalledTimes(1);
    });

    it('should update all seats status by seats', async () => {
      const seats = ['1A', '1B', '1C'];
      const payload = { status: 'AVAILABLE' };
      const mockTx = {
        seat: {
          updateMany: jest.fn()
        }
      };

      await seatRepository.updateSeatStatusBySeats(seats, payload, mockTx);

      expect(mockTx.seat.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: seats
          }
        },
        data: {
          status: {
            status: payload.status
          }
        }
      });
      expect(mockTx.seat.updateMany).toHaveBeenCalledTimes(1);
    });
  });
});
