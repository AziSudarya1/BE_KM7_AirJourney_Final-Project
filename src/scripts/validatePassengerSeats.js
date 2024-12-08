import { HttpError } from '../utils/error.js';

export async function validatePassengersSeats(
  passengers,
  returnFlight,
  departureSeats,
  returnSeats
) {
  const seatIds = [];

  for (const passengerItem of passengers) {
    if (passengerItem.type !== 'INFANT') {
      const departureSeatId = passengerItem.departureSeatId;

      const departureSeat = departureSeats.find(
        (seat) => seat.id === departureSeatId
      );

      if (!departureSeat) {
        throw new HttpError('Departure seat not found', 400);
      }

      if (departureSeat.status !== 'AVAILABLE') {
        throw new HttpError('Departure seat is already booked', 400);
      }

      if (seatIds.includes(departureSeatId)) {
        throw new HttpError(
          'Departure seat ID must be unique for all passengers',
          400
        );
      }

      if (!returnFlight && passengerItem.returnSeatId) {
        throw new HttpError('Return flight must be provided', 400);
      }

      seatIds.push(passengerItem.departureSeatId);
    }
  }

  if (returnFlight) {
    for (const passengerItem of passengers) {
      if (passengerItem.type !== 'INFANT') {
        const returnSeatId = passengerItem.returnSeatId;

        if (!returnSeatId) {
          throw new HttpError(
            'Return seat must be provided for return flight',
            400
          );
        }

        const returnSeat = returnSeats.find((seat) => seat.id === returnSeatId);

        if (!returnSeat) {
          throw new HttpError('Return seat not found', 400);
        }

        if (returnSeat.status !== 'AVAILABLE') {
          throw new HttpError('Return seat is already booked', 400);
        }

        if (seatIds.includes(returnSeatId)) {
          throw new HttpError(
            'Return seat ID must be unique for all passengers',
            400
          );
        }

        seatIds.push(passengerItem.returnSeatId);
      }
    }
  }

  return seatIds;
}
