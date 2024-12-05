import { prisma } from '../utils/db.js';

export function createTransaction(payload, userId) {
  return prisma.transaction.create({
    data: {
      transactionCode: payload.transactionCode,
      amount: payload.amount,
      status: 'UNPAID',
      userId: userId,
      departureFlightId: payload.departureFlightId,
      returnFlightId: payload.returnFlightId || null,
      Passenger: {
        createMany: {
          data: payload.passengers.map((passenger, index) => ({
            title: passenger.title,
            firstName: passenger.firstName,
            familyName: passenger.familyName,
            birthday: passenger.birthday,
            nationality: passenger.nationality,
            nikPaspor: passenger.nikPaspor,
            nikKtp: passenger.nikKtp,
            expiredAt: passenger.expiredAt,
            departureSeatId: payload.seats[index]?.departureSeatId || null,
            returnSeatId: payload.seats[index]?.returnSeatId || null
          }))
        }
      }
    },
    include: {
      Passenger: true
    }
  });
}

export async function checkSeatAvailability(seatId) {
  const seat = await prisma.seat.findUnique({
    where: {
      id: seatId
    },
    select: {
      status: true
    }
  });

  return seat?.status === 'AVAILABLE';
}

export function markSeatAsBooked(seatId) {
  return prisma.seat.update({
    where: {
      id: seatId
    },
    data: {
      status: 'BOOKED'
    }
  });
}
