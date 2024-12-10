/* eslint-disable no-console */
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import { appEnv } from '../env.js';
import { generateSeats } from '../../scripts/generateSeats.js';

async function seedUsers() {
  const users = [
    {
      name: 'Admin',
      email: appEnv.EMAIL_ADDRESS_ADMIN,
      password: await bcrypt.hash(appEnv.PASSWORD_ADMIN, 10),
      role: 'ADMIN',
      phoneNumber: '1234567890',
      verified: true
    },
    {
      name: 'User',
      email: appEnv.EMAIL_ADDRESS_USER,
      password: await bcrypt.hash(appEnv.PASSWORD_USER, 10),
      role: 'USER',
      phoneNumber: '1234567891',
      verified: true
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }
}

async function seedAirport() {
  const airports = [
    {
      name: 'Soekarno-Hatta International Airport',
      code: 'CGK',
      continent: 'ASIA',
      city: 'Tangerang',
      country: 'Indonesia'
    },
    {
      name: 'Changi Airport',
      code: 'SIN',
      continent: 'ASIA',
      city: 'Singapore',
      country: 'Singapore'
    },
    {
      name: 'Heathrow Airport',
      code: 'LHR',
      continent: 'EUROPE',
      city: 'London',
      country: 'United Kingdom'
    },
    {
      name: 'Los Angeles International Airport',
      code: 'LAX',
      continent: 'NORTH_AMERICA',
      city: 'Los Angeles',
      country: 'United States'
    },
    {
      name: 'Sydney Airport',
      code: 'SYD',
      continent: 'AUSTRALIA',
      city: 'Sydney',
      country: 'Australia'
    }
  ];

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { code: airport.code, name: airport.name },
      update: {},
      create: airport
    });
  }
}

async function seedAirlines() {
  const airlines = [
    {
      name: 'Garuda Indonesia',
      code: 'GA'
    },
    {
      name: 'Singapore Airlines',
      code: 'SQ'
    },
    {
      name: 'British Airways',
      code: 'BA'
    },
    {
      name: 'American Airlines',
      code: 'AA'
    },
    {
      name: 'Qantas',
      code: 'QF'
    }
  ];

  for (const airline of airlines) {
    await prisma.airline.upsert({
      where: { code: airline.code, name: airline.name },
      update: {},
      create: airline
    });
  }
}

async function seedAeroplanes() {
  const aeroplanes = [
    {
      name: 'Boeing 737',
      code: 'B737',
      type: 'Narrow-body',
      maxRow: 12,
      maxColumn: 6
    },
    {
      name: 'Airbus A350',
      code: 'A350',
      type: 'Wide-body',
      maxRow: 6,
      maxColumn: 4
    },
    {
      name: 'Boeing 777',
      code: 'B777',
      type: 'Wide-body',
      maxRow: 8,
      maxColumn: 5
    },
    {
      name: 'Airbus A380',
      code: 'A380',
      type: 'Wide-body',
      maxRow: 9,
      maxColumn: 6
    },
    {
      name: 'Boeing 787',
      code: 'B787',
      type: 'Wide-body',
      maxRow: 12,
      maxColumn: 4
    }
  ];

  for (const aeroplane of aeroplanes) {
    await prisma.aeroplane.upsert({
      where: { code: aeroplane.code },
      update: {},
      create: aeroplane
    });
  }
}

async function seedFlights() {
  const aeroplanes = await prisma.aeroplane.findMany();
  const airlines = await prisma.airline.findMany();
  const airports = await prisma.airport.findMany();

  const someEmpty = !aeroplanes.length || !airlines.length || !airports.length;

  if (someEmpty) {
    throw new Error('Aeroplanes, airlines, or airports are not seeded');
  }

  const flightExists = await prisma.flight.findFirst();

  if (flightExists) {
    return;
  }

  const flights = [
    {
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      arrivalTime: '08:00',
      departureTime: '06:00',
      duration: 120,
      price: 100,
      class: 'ECONOMY',
      description: 'Flight from Jakarta to Singapore',
      airlineId: airlines[0].id,
      airportIdFrom: airports[0].id,
      airportIdTo: airports[1].id,
      aeroplaneId: aeroplanes[0].id
    },
    {
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      arrivalTime: '10:00',
      departureTime: '08:00',
      duration: 120,
      price: 200,
      class: 'BUSINESS',
      description: 'Flight from Jakarta to London',
      airlineId: airlines[0].id,
      airportIdFrom: airports[0].id,
      airportIdTo: airports[2].id,
      aeroplaneId: aeroplanes[1].id
    },
    {
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      arrivalTime: '12:00',
      departureTime: '10:00',
      duration: 120,
      price: 300,
      class: 'PREMIUM_ECONOMY',
      description: 'Flight from Jakarta to Los Angeles',
      airlineId: airlines[0].id,
      airportIdFrom: airports[0].id,
      airportIdTo: airports[3].id,
      aeroplaneId: aeroplanes[2].id
    },
    {
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
      arrivalTime: '14:00',
      departureTime: '12:00',
      duration: 120,
      price: 400,
      class: 'ECONOMY',
      description: 'Flight from Jakarta to Sydney',
      airlineId: airlines[0].id,
      airportIdFrom: airports[0].id,
      airportIdTo: airports[4].id,
      aeroplaneId: aeroplanes[3].id
    }
  ];

  await prisma.flight.createMany({
    data: flights
  });
}

async function seedSeats() {
  const flights = await prisma.flight.findMany();

  for (const flight of flights) {
    const seatsExist = await prisma.seat.findFirst({
      where: { flightId: flight.id }
    });

    if (seatsExist) {
      return;
    }

    const aeroplane = await prisma.aeroplane.findUnique({
      where: { id: flight.aeroplaneId }
    });

    const seats = generateSeats(
      aeroplane.maxRow,
      aeroplane.maxColumn,
      aeroplane.id,
      flight.id
    );

    await prisma.seat.createMany({
      data: seats
    });
  }
}

async function main() {
  try {
    await seedUsers();
    await seedAirport();
    await seedAirlines();
    await seedAeroplanes();
    await seedFlights();
    await seedSeats();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
