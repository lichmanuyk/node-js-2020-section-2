import express from 'express';
import { UserController } from './user/user.controller';
import { JoiValidator } from './validator';

const app = express();
const port = 8080;
const userController = new UserController(new JoiValidator());

app.use(express.json());
app.use('/', userController.router);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
