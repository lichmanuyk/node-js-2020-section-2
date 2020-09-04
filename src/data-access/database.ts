import { Sequelize } from 'sequelize';
import { Client } from 'pg';

const DB_NAME = 'postgres';
const DB_USER_NAME = 'postgres';
const DB_USER_PASSWORD = '12345';
const HOST = 'localhost';
const PORT = 5432;

export const pg = new Client({
  user: DB_USER_NAME,
  host: HOST,
  database: DB_NAME,
  password: DB_USER_PASSWORD,
  port: PORT,
});

export const sequelize = new Sequelize(
  DB_NAME,
  DB_USER_NAME,
  DB_USER_PASSWORD,
  {
    host: HOST,
    port: PORT,
    dialect: 'postgres',
  }
);
