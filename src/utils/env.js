/* eslint-disable no-console */
import dotenv from 'dotenv';
import { access } from 'fs/promises';

async function loadEnv() {
  const isRunningInDevelopment = process.env.NODE_ENV === 'development';

  let envPath = undefined;

  if (isRunningInDevelopment) {
    const isLocalEnvExists = await access('.env.local')
      .then(() => true)
      .catch(() => false);

    if (!isLocalEnvExists) {
      throw new Error('Local environment file (.env.local) is missing');
    }

    envPath = '.env.local';

    console.log(`Loading environment variables from ${envPath}`);
  } else {
    console.log('Loading environment variables from .env or process.env');
  }

  dotenv.config({ path: envPath });
}

function formatEnv() {
  const PORT = process.env.PORT ?? process.env.HOST_PORT;

  return {
    ...process.env,
    PORT
  };
}

await loadEnv();

export const appEnv = formatEnv();
