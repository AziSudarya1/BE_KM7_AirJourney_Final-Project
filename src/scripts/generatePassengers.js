import * as seatService from '../services/seat.js';

export async function generatePassengers(passengerData, flight) {
  const passengers = [];

  for (const passengerInfo of passengerData) {
    const isInfant = passengerInfo.type === 'INFANT';

    const seat = await seatService.getSeatByIdAndFlightId(
      passengerInfo.departureSeatId,
      flight.id
    );

    if (!isInfant) {
      await seatService.updateSeatStatus(seat.id);
    }

    const passenger = {
      title: passengerInfo.title,
      firstName: passengerInfo.firstName,
      familyName: passengerInfo.familyName,
      birthday: new Date(passengerInfo.birthday),
      nationality: passengerInfo.nationality,
      type: passengerInfo.type,
      nikPaspor: passengerInfo.nikPaspor,
      nikKtp: passengerInfo.nikKtp,
      expiredAt: new Date(passengerInfo.expiredAt),
      departureSeatId: passengerInfo.departureSeatId,
      returnSeatId: passengerInfo.returnSeatId || null
    };

    passengers.push(passenger);
  }

  return passengers;
}
