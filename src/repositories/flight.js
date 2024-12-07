import { prisma } from '../utils/db.js';

export function createFlightAndSeat(payload) {
  return prisma.flight.create({
    data: {
      departureDate: new Date(payload.departureDate),
      departureTime: payload.departureTime,
      arrivalDate: new Date(payload.arrivalDate),
      duration: payload.duration,
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

export function getAllFlight(cursorId, filter) {
  const query = {
    where: {
      departureDate: {
        gte: new Date()
      },
      seat: {
        some: {
          status: 'AVAILABLE'
        }
      }
    },
    take: 3,
    orderBy: {
      departureDate: 'asc'
    },
    include: {
      airportFrom: true,
      airportTo: true,
      airline: true,
      aeroplane: true
    }
  };

  if (cursorId) {
    query.cursor = {
      id: cursorId
    };
    query.skip = 1;
  }

  if (Object.keys(filter).length) {
    query.where = {
      ...query.where,
      ...filter
    };
  }

  return prisma.flight.findMany(query);
}

export function getDetailFlightById(id) {
  return prisma.flight.findUnique({
    where: {
      id
    },
    include: {
      seat: true,
      airportFrom: true,
      airportTo: true,
      airline: true,
      aeroplane: true
    }
  });
}

export function getFlightById(id) {
  return prisma.flight.findUnique({
    where: {
      id
    }
  });
}
