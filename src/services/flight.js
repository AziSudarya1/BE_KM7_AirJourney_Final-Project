import { HttpError } from '../utils/error.js';
import * as airportService from '../services/airport.js';
import * as airlineService from '../services/airline.js';
import * as flightRepository from '../repositories/flight.js';
import { generateSeats } from '../scripts/generateSeats.js';

export async function validateCreateFlightIdAndGetAeroplane(
  airportIdFrom,
  airportIdTo,
  airlineId
) {
  if (airportIdFrom === airportIdTo) {
    throw new HttpError(
      'Departure and arrival airport cannot be the same',
      400
    );
  }

  const airportFrom = await airportService.getAirportById(airportIdFrom);
  const airportTo = await airportService.getAirportById(airportIdTo);

  if (!airportFrom || !airportTo) {
    throw new HttpError('Airport not found', 404);
  }

  const airline = await airlineService.getAirlineById(airlineId);

  if (!airline) {
    throw new HttpError('Airline not found', 404);
  }
}

export async function createFlightAndSeat(payload, aeroplane) {
  const seats = generateSeats(
    aeroplane.maxRow,
    aeroplane.maxColumn,
    aeroplane.id
  );

  const flight = await flightRepository.createFlightAndSeat({
    ...payload,
    seats
  });

  return flight;
}

export async function getAllFlight(filter, sort, meta, favourite) {
  const skip = meta.skip;

  const query = {
    take: meta.limit,
    where: {
      departureDate: {
        gte: new Date()
      }
    },
    include: {
      airportFrom: true,
      airportTo: true,
      airline: true,
      aeroplane: true,
      _count: {
        select: {
          seat: {
            where: {
              status: 'AVAILABLE'
            }
          }
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  };

  if (skip) {
    query.skip = skip;
  }

  const sortKey = Object.keys(sort)[0];

  if (sortKey) {
    query.orderBy = {
      [sortKey]: sort[sortKey]
    };
  }

  if (Object.keys(filter).length) {
    query.where = {
      ...query.where,
      ...filter
    };
  }

  if (favourite) {
    query.distinct = ['airportIdFrom', 'airportIdTo'];
    query.orderBy = {
      departureTransaction: {
        _count: 'desc'
      }
    };
  }

  const flight = await flightRepository.getAllFlight(query);

  return flight;
}

export async function getDetailFlightById(id) {
  const data = await flightRepository.getDetailFlightById(id);

  return data;
}

export async function getFlightWithSeatsById(id) {
  const data = await flightRepository.getFlightWithSeatsById(id);

  return data;
}

export async function getFlightById(id) {
  const data = await flightRepository.getFlightById(id);

  return data;
}

export async function countFlightDataWithFilterAndCreateMeta(
  filter,
  page,
  favourite
) {
  const limit = 10;
  let totalPage = 1;
  let skip = 0;
  let totalData;

  if (!favourite) {
    const query = {
      take: limit,
      where: {
        departureDate: {
          gte: new Date()
        }
      }
    };

    if (Object.keys(filter).length) {
      query.where = {
        ...query.where,
        ...filter
      };
    }

    totalData = await flightRepository.countFlightDataWithFilter(query);

    if (totalData) {
      totalPage = Math.ceil(totalData / limit);

      if (page > totalPage) {
        throw new HttpError('Page not found', 404);
      }

      skip = (page - 1) * limit;
    }
  }

  return {
    page,
    limit,
    totalPage,
    ...(totalData && { totalData }),
    skip,
    favourite
  };
}
