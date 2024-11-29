import { prisma } from '../utils/db.js';

export function createFlight(data) {
  return prisma.flight.create({
    data: {
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      arrivalDate: data.arrivalDate,
      arrivalTime: data.arrivalTime,
      duration: data.duration,
      price: data.price,
      class: data.class,
      description: data.description,
      airlineId: data.airlineId,
      airportIdFrom: data.airportIdFrom,
      airportIdTo: data.airportIdTo,
      aeroplaneId: data.aeroplaneId,
      seat: {
        createMany: data.seat
      }
    }
  });
}
