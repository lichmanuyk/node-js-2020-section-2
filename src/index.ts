import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { logger } from './logger';
import { GroupController, UserController } from './controllers/index';
import { UserJoiValidator, GroupJoiValidator } from './validators/index';
import { GroupService, UserService } from './services/index';
import { GroupRepository, UserRepository, UserGroupRepository, initDBData } from './data-access/index';

process.on('uncaughtException', logger.error);
process.on('unhandledrejection', (reason, promise) => {
  logger.error(`Unhandled Promise Rejection at:${promise}, reason: ${reason}`);
});

const app = express();
const port = 8080;

const userRepository = new UserRepository(logger);
const groupRepository = new GroupRepository(logger);
const userGroupRepository = new UserGroupRepository(logger);

const userService = new UserService(userRepository, userGroupRepository, logger);
const groupService = new GroupService(groupRepository, userGroupRepository, logger);

const userJoiValidator = new UserJoiValidator(userService);
const groupJoiValidator = new GroupJoiValidator(groupService);

const userController = new UserController(userJoiValidator, userService, logger);
const groupController = new GroupController(groupJoiValidator, groupService, logger);

app.use(express.json());
app.use(cors());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err);
    res.sendStatus(500);
  }
  next();
});

app.use('/', userController.router, groupController.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  initDBData(logger);
});


