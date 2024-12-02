/* eslint-disable no-console */
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import { appEnv } from '../env.js';

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
      maxRow: 30,
      maxColumn: 6
    },
    {
      name: 'Airbus A350',
      code: 'A350',
      type: 'Wide-body',
      maxRow: 40,
      maxColumn: 9
    },
    {
      name: 'Boeing 777',
      code: 'B777',
      type: 'Wide-body',
      maxRow: 45,
      maxColumn: 10
    },
    {
      name: 'Airbus A380',
      code: 'A380',
      type: 'Wide-body',
      maxRow: 50,
      maxColumn: 10
    },
    {
      name: 'Boeing 787',
      code: 'B787',
      type: 'Wide-body',
      maxRow: 35,
      maxColumn: 9
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

async function main() {
  try {
    await seedUsers();
    await seedAirport();
    await seedAirlines();
    await seedAeroplanes();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
