/* eslint-disable no-console */
import dotenv from 'dotenv';

export async function loadEnv() {
  const isRunningInDevelopment = process.env.NODE_ENV === 'development';

  let envPath = undefined;

  if (isRunningInDevelopment) {
    envPath = '.env.local';

    console.log(`Loading environment variables from ${envPath}`);
  } else {
    console.log('Loading environment variables from .env or process.env');
  }

  dotenv.config({ path: envPath });
}
