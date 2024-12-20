/* eslint-disable no-console */
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import { appEnv } from '../env.js';
import { generateSeats } from '../../services/flight.js';
import { ALLOWED_CLASS } from '../../middlewares/validation/flight.js';

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
      image: 'https://logotyp.us/file/garuda-indonesia.svg',
      code: 'GA'
    },
    {
      name: 'Singapore Airlines',
      image: 'https://logotyp.us/file/singapore-airlines.svg',
      code: 'SQ'
    },
    {
      name: 'British Airways',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMkrHp1xK4Ehd0b6xWa5ZnNdZOupeGX4kdTQ&s',
      code: 'BA'
    },
    {
      name: 'American Airlines',
      image:
        'https://s202.q4cdn.com/986123435/files/doc_news/2022/04/1/AA-Destination-Net-Zero-pos-4x-100.jpeg',
      code: 'AA'
    },
    {
      name: 'Qantas',
      image:
        'https://fiu-original.b-cdn.net/fontsinuse.com/use-images/47/47831/47831.png?filename=Captura%20de%20pantalla%202017-01-25%20a%20les%2015.35.00.png',
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

  const flights = [];

  for (let i = 0; i < 50; i++) {
    const randomAirlinesId =
      airlines[Math.floor(Math.random() * airlines.length)].id;
    const randomAeroplanesId =
      aeroplanes[Math.floor(Math.random() * aeroplanes.length)].id;
    let randomAirportsId =
      airports[Math.floor(Math.random() * airports.length)].id;
    const randomClass =
      ALLOWED_CLASS[Math.floor(Math.random() * ALLOWED_CLASS.length)];

    while (randomAirportsId === airports[0].id) {
      randomAirportsId =
        airports[Math.floor(Math.random() * airports.length)].id;
    }

    flights.push({
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 9)),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 10)),
      arrivalTime: '16:00',
      departureTime: '14:00',
      duration: 120,
      price: 500 + i * 50,
      class: randomClass,
      description: `Flight from Jakarta to Destination ${i + 1}`,
      airlineId: randomAirlinesId,
      airportIdFrom: airports[0].id,
      airportIdTo: randomAirportsId,
      aeroplaneId: randomAeroplanesId
    });

    flights.push({
      departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 11)),
      arrivalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 12)),
      arrivalTime: '18:00',
      departureTime: '16:00',
      duration: 120,
      price: 500 + i * 50,
      class: randomClass,
      description: `Return flight from Destination ${i + 1} to Jakarta`,
      airlineId: randomAirlinesId,
      airportIdFrom: randomAirportsId,
      airportIdTo: airports[0].id,
      aeroplaneId: randomAeroplanesId
    });
  }

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
