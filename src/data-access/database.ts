import { Sequelize } from 'sequelize';
import { Client } from 'pg';

export const pg = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5432,
});

// const DB_NAME = 'postgres';
// const DB_USER_NAME = 'postgres';
// const DB_USER_PASSWORD = '12345';

// export const sequelize = new Sequelize(
//   DB_NAME,
//   DB_USER_NAME,
//   DB_USER_PASSWORD,
//   {
//     host: 'localhost',
//     port: 5432,
//     dialect: 'postgres',
//   }
// );

