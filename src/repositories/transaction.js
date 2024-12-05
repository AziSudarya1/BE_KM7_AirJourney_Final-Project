import { prisma } from '../utils/db.js';

export function createTransaction(data, userId, seatData, passengerData) {
  return prisma.transaction.create({
    data: {
      transactionCode: data.transactionCode,
      amount: data.amount,
      status: 'UNPAID',
      userId,
      departureFlightId: data.departureFlightId,
      returnFlightId: data.returnFlightId || null,
      Passenger: {
        create: passengerData.map((passenger) => ({
          title: passenger.title,
          firstName: passenger.firstName,
          familyName: passenger.familyName,
          birthday: passenger.birthday,
          nationality: passenger.nationality,
          nikPaspor: passenger.nikPaspor,
          nikKtp: passenger.nikKtp,
          expiredAt: passenger.expiredAt,
          departureSeatId:
            passenger.type !== 'INFANT'
              ? seatData[passenger.type].departureSeatId
              : null,
          returnSeatId:
            passenger.type !== 'INFANT'
              ? seatData[passenger.type].returnSeatId
              : null
        }))
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
