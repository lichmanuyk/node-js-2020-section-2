import express from 'express';

import { UserController } from './controllers/index';
import { JoiValidator } from './validators/index';
import { UserService } from './services/index';
import { pg } from './data-access/index';
import { MOCK_USERS } from './data-access/mock-users';
import { User } from './types/index';

const app = express();
const port = 8080;
const userService = new UserService();
const joiValidator = new JoiValidator(userService);
const userController = new UserController(joiValidator, userService);

app.use(express.json());
app.use('/', userController.router);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
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
            id varchar(255),
            login varchar(255),
            password varchar(255),
            age int,
            isDeleted boolean
          );
        `);
}

function addUserToTable(mockUser: User) {
  return pg.query(`
    INSERT INTO "User"
    ("id", "login", "password", "age", "isdeleted")
    values (${mockUser.id}, '${mockUser.login}', '${mockUser.password}', ${mockUser.age}, ${mockUser.isDeleted});
  `);
}
