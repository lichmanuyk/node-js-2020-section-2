import { Sequelize } from 'sequelize';
import { Client } from 'pg';
import { Logger } from 'winston';

import { UserModel } from '../types/index';
import { MOCK_USERS } from './mock-users';
import { Config } from '../config';

const config = new Config();

// I use it just for SQL queries from the first task. In all other cases I use sequelize that is below.
export const pg = new Client({
  user: config.DB_USER_NAME,
  host: config.HOST,
  database: config.DB_NAME,
  password: config.DB_USER_PASSWORD,
  port: Number(config.PORT),
});

export const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER_NAME,
  config.DB_USER_PASSWORD,
  {
    host: config.HOST,
    port: Number(config.PORT),
    dialect: 'postgres',
  }
);

export function initDBData(logger: Logger) {
  pg.connect().then(() => {
    console.log('Connected');

    createGroupTable()
      .then(() => console.log('Group database created'))
      .catch(logger.error);

    createUserGroupTable()
      .then(() => console.log('UserGroup database created'))
      .catch(logger.error);

    createUserTable()
      .then(() => {
        console.log('User dataBase created');
        MOCK_USERS.forEach((mockUser) => {
          addUserToTable(mockUser)
            .then(() => console.log('User added to db'))
            .catch(logger.error);
        });
      })
      .catch(logger.error);
  });
}

function createUserGroupTable() {
  return pg.query(`
  CREATE TABLE "UserGroup" (
    id uuid,
    "userId" uuid,
    "groupId" uuid
  );
`);
}

function createUserTable() {
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

function createGroupTable() {
  return pg.query(`
          CREATE TABLE "Group" (
            id uuid,
            name varchar(255),
            permissions varchar(255)[]
          );
  `)
}

function addUserToTable(mockUser: UserModel) {
  return pg.query(`
    INSERT INTO "User"
    ("id", "login", "password", "age", "isDeleted")
    values ('${mockUser.id}', '${mockUser.login}', '${mockUser.password}', ${mockUser.age}, ${mockUser.isDeleted});
  `);
}
