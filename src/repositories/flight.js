import { prisma } from '../utils/db';

export function createFlightAndSeat(payload) {
  return prisma.flight.create({
    data: {
      departureDate: payload.departureDate,
      departureTime: payload.departureTime,
      arrivalDate: payload.arrivalDate,
      arrivalTime: payload.arrivalTime,
      duration: payload.duration,
      price: payload.price,
      class: payload.class,
      description: payload.description,
      airlineId: payload.airlineId,
      airportIdFrom: payload.airportIdFrom,
      airportIdTo: payload.airportIdTo,
      aeroplaneId: payload.aeroplaneId,
      seat: {
        createMany: {
          data: payload.seats
        }
      }
    }
  });
}
