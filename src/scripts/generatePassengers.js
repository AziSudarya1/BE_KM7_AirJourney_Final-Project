import * as seatService from '../services/seat.js';
import { HttpError } from '../utils/error.js';

export async function generatePassengers(
  passengerData,
  departureFlight,
  returnFlight
) {
  const passengers = [];
  const departureSeatIds = [];
  const returnSeatIds = [];

  for (const passengerItem of passengerData) {
    if (passengerItem.type !== 'INFANT') {
      departureSeatIds.push(passengerItem.departureSeatId);
    }
    if (passengerItem.type !== 'INFANT' && passengerItem.returnSeatId) {
      returnSeatIds.push(passengerItem.returnSeatId);
    }
  }

  const checkDepartureSeatIds = new Set(departureSeatIds);
  if (checkDepartureSeatIds.size !== departureSeatIds.length) {
    throw new HttpError(
      'Departure seat not be the same for all passengers',
      400
    );
  }

  const checkReturnSeatIds = new Set(returnSeatIds);
  if (checkReturnSeatIds.size !== returnSeatIds.length) {
    throw new HttpError('Return seat not be the same for all passengers', 400);
  }

  const departureSeats = [];
  for (const seatId of departureSeatIds) {
    const departureSeat = await seatService.getSeatByIdAndFlightId(
      seatId,
      departureFlight.id
    );
    if (departureSeat) {
      departureSeats.push(departureSeat);
    } else {
      throw new HttpError('Departure seat not found', 400);
    }
  }

  const returnSeats = [];
  for (const seatId of returnSeatIds) {
    const returnSeat = await seatService.getSeatByIdAndFlightId(
      seatId,
      returnFlight.id
    );
    if (returnSeat) {
      returnSeats.push(returnSeat);
    } else {
      throw new HttpError('Return seat not found', 400);
    }
  }

  for (const departureSeat of departureSeats) {
    if (departureSeat.status !== 'AVAILABLE') {
      throw new HttpError('Departure seat is not available', 400);
    }
  }

  for (const returnSeat of returnSeats) {
    if (returnSeat.status !== 'AVAILABLE') {
      throw new HttpError('Return seat is not available', 400);
    }
  }

  for (const passengerItem of passengerData) {
    const isInfant = passengerItem.type === 'INFANT';

    const departureSeat = departureSeats.find(
      (seat) => seat.id === passengerItem.departureSeatId
    );

    let returnSeat = null;
    if (passengerItem.returnSeatId) {
      returnSeat = returnSeats.find(
        (seat) => seat.id === passengerItem.returnSeatId
      );
    }

    if (!isInfant) {
      await seatService.updateSeatStatus(departureSeat.id);
      if (returnSeat) {
        await seatService.updateSeatStatus(returnSeat.id);
      }
    }

    const passenger = {
      title: passengerItem.title,
      firstName: passengerItem.firstName,
      familyName: passengerItem.familyName,
      birthday: new Date(passengerItem.birthday),
      nationality: passengerItem.nationality,
      type: passengerItem.type,
      nikPaspor: passengerItem.nikPaspor,
      nikKtp: passengerItem.nikKtp,
      expiredAt: new Date(passengerItem.expiredAt),
      departureSeatId: passengerItem.departureSeatId,
      returnSeatId: passengerItem.returnSeatId || null
    };

    passengers.push(passenger);
  }

  return passengers;
}
