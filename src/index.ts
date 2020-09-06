import express from 'express';

import { UserController } from './controllers/index';
import { JoiValidator } from './validators/index';
import { UserService } from './services/index';
import { UserRepository } from './data-access/index';
import { initDBData } from './data-access/index';

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
  initDBData();
});


