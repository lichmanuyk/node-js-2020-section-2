import express from 'express';

import { UserController } from './controllers/index';
import { JoiValidator } from './validators/index';
import { UserService } from './services/index';
import { pg, UserRepository } from './data-access/index';
import { MOCK_USERS } from './data-access/index';
import { UserModel } from './types/index';
import { User } from './models/index';

const app = express();
const port = 8080;

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const joiValidator = new JoiValidator(userService);
const userController = new UserController(joiValidator, userService);

app.use(express.json());
app.use('/', userController.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);

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
});

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
