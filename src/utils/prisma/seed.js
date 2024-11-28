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
      phoneNumber: '1234567890'
    },
    {
      name: 'User',
      email: appEnv.EMAIL_ADDRESS_USER,
      password: await bcrypt.hash(appEnv.PASSWORD_USER, 10),
      role: 'USER',
      phoneNumber: '1234567891'
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

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
