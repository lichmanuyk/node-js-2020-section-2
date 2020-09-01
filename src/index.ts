import express from 'express';

import { UserController } from './controllers/index';
import { JoiValidator } from './validators/index';
import { UserService } from './services/index';

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
});
