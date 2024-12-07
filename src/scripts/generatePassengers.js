import * as seatService from '../services/seat.js';
import { HttpError } from '../utils/error.js';

export async function generatePassengers(
  passengerData,
  departureFlight,
  returnFlight
) {
  const passengers = [];

  for (const passengerItem of passengerData) {
    const isInfant = passengerItem.type === 'INFANT';

    const departureSeat = await seatService.getSeatByIdAndFlightId(
      passengerItem.departureSeatId,
      departureFlight.id
    );

    if (!departureSeat) {
      throw new HttpError('Departure seat not found', 400);
    }

    if (departureSeat.status !== 'AVAILABLE') {
      throw new HttpError('Departure seat is not available', 400);
    }

    let returnSeat = null;
    if (passengerItem.returnSeatId) {
      returnSeat = await seatService.getSeatByIdAndFlightId(
        passengerItem.returnSeatId,
        returnFlight.id
      );

      if (!returnSeat) {
        throw new HttpError('Return seat not found', 400);
      }

      if (returnSeat.status !== 'AVAILABLE') {
        throw new HttpError('Return seat is not available', 400);
      }
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
