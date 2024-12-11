import { HttpError } from '../utils/error.js';

export async function validatePassengers(
  passengers,
  returnFlight,
  departureSeats,
  returnSeats
) {
  const seatIds = [];
  const identityNumbers = [];

  const proccessedPassengers = passengers.map((passengerItem, index) => {
    const passengerNumber = index + 1;

    if (passengerItem.type !== 'INFANT') {
      const departureSeatId = passengerItem.departureSeatId;

      const departureSeat = departureSeats.find(
        (seat) => seat.id === departureSeatId
      );

      if (!departureSeat) {
        throw new HttpError(
          `Departure seat for passenger number ${passengerNumber} not found`,
          400
        );
      }

      if (departureSeat.status !== 'AVAILABLE') {
        throw new HttpError(
          `Departure seat for passenger number ${passengerNumber} is already booked`,
          400
        );
      }

      if (seatIds.includes(departureSeatId)) {
        throw new HttpError(
          'Departure seat ID must be unique for all passengers',
          400
        );
      }

      if (!returnFlight && passengerItem.returnSeatId) {
        throw new HttpError(
          `Return flight seat for passenger number ${passengerNumber} forbidden`,
          400
        );
      }

      const identityNumber = passengerItem.identityNumber;
      const identityNumberPassenger = identityNumbers.find(
        (number) => number === identityNumber
      );

      if (identityNumberPassenger) {
        throw new HttpError(
          `Identity number for passenger number ${passengerNumber} must be unique`,
          400
        );
      }

      identityNumbers.push(identityNumber);
      seatIds.push(departureSeatId);
    }

    return {
      ...passengerItem,
      birthday: new Date(passengerItem.birthday),
      expiredAt: new Date(passengerItem.expiredAt)
    };
  });

  if (returnFlight) {
    passengers.map((passengerItem, index) => {
      const passengerNumber = index + 1;

      if (passengerItem.type !== 'INFANT') {
        const returnSeatId = passengerItem.returnSeatId;

        const returnSeat = returnSeats.find((seat) => seat.id === returnSeatId);

        if (!returnSeat) {
          throw new HttpError(
            `Return seat for passenger number ${passengerNumber} not found`,
            400
          );
        }

        if (returnSeat.status !== 'AVAILABLE') {
          throw new HttpError(
            `Return seat for passenger number ${passengerNumber} is already booked`,
            400
          );
        }

        if (seatIds.includes(returnSeatId)) {
          throw new HttpError(
            'Return seat ID must be unique for all passengers',
            400
          );
        }

        seatIds.push(returnSeatId);
      }
    });
  }

  return { seatIds, proccessedPassengers };
}
