import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' }); // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;
// const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SERVER_URL = process.env.SERVER_URL;

export const JWT_SECRET = process.env['JWT_SECRET'];
if (!JWT_SECRET) {
  logger.error('No JWT secret. Set JWT_SECRET environment variable.');
  process.exit(1);
}

export const DB_NAME = process.env['DB_NAME'];
export const DB_USER = process.env['DB_USER'];
export const DB_PASS = process.env['DB_PASS'];
export const DB_HOST = process.env['DB_HOST'];
