import express from 'express';

import { GroupController, UserController } from './controllers/index';
import { UserJoiValidator, GroupJoiValidator } from './validators/index';
import { GroupService, UserService } from './services/index';
import { GroupRepository, UserRepository, initDBData } from './data-access/index';

const app = express();
const port = 8080;

const userRepository = new UserRepository();
const groupRepository = new GroupRepository();

const userService = new UserService(userRepository);
const groupService = new GroupService(groupRepository);

const userJoiValidator = new UserJoiValidator(userService);
const groupJoiValidator = new GroupJoiValidator(groupService);

const userController = new UserController(userJoiValidator, userService);
const groupController = new GroupController(groupJoiValidator, groupService);

app.use(express.json());
app.use('/', userController.router, groupController.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  initDBData();
});


