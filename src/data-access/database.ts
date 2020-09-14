import { Sequelize } from 'sequelize';
import { Client } from 'pg';

import { UserModel } from '../types/index';
import { MOCK_USERS } from './mock-users';

const DB_NAME = 'postgres';
const DB_USER_NAME = 'postgres';
const DB_USER_PASSWORD = '12345';
const HOST = 'localhost';
const PORT = 5432;

// I use it just for SQL queries from the first task. In all other cases I use sequelize that is below.
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

export function initDBData() {
  pg.connect().then(() => {
    console.log('Connected');
    createUserTableAndAddUsers()
      .then(() => {
        console.log('DataBase created');
        MOCK_USERS.forEach((mockUser) => {
          addUserToTable(mockUser)
            .then(() => console.log('User added to db'))
            .catch((err) => console.log(err.message));
        });
      })
      .catch((err) => console.log(err.message));
  });
}

function createUserTableAndAddUsers() {
  return pg.query(`
          CREATE TABLE "User" (
            id uuid,
            login varchar(255),
            password varchar(255),
            age int,
            "isDeleted" boolean
          );
        `);
}

function addUserToTable(mockUser: UserModel) {
  return pg.query(`
    INSERT INTO "User"
    ("id", "login", "password", "age", "isDeleted")
    values ('${mockUser.id}', '${mockUser.login}', '${mockUser.password}', ${mockUser.age}, ${mockUser.isDeleted});
  `);
}
