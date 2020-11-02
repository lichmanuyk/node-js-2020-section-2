import { UserGroupRepository, UserRepository } from '../data-access/index';
import { AuthService, UserService } from '../services/index';
import { AuthJoiValidator, UserJoiValidator } from '../validators/index';
import { UserController } from './user.controller';
import { logger } from '../logger/index';
import { AuthController } from '../controllers/auth.controller';
import { Config } from '../config/index';

jest.mock('../logger/index');
jest.mock('../data-access/user-group-repository');
jest.mock('../data-access/user-repository');
jest.mock('../services/user.service');
jest.mock('../services/auth.service');
jest.mock('../validators/user-validator');
jest.mock('../validators/auth-validator');
jest.mock('../config/config');
jest.mock('../controllers/auth.controller');

const config = new Config();
const userGroupRepository = new UserGroupRepository(logger);
const userRepository = new UserRepository(logger);
const userService = new UserService(userRepository, userGroupRepository, logger);
const authService = new AuthService(config, userService);
const validator = new UserJoiValidator(userService);
const authJoiValidator = new AuthJoiValidator();
const authController = new AuthController(config, authJoiValidator, authService, logger);
const userController = new UserController(validator, userService, logger, authController.chechAuth);

describe('UserController', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create path property', () => {
    expect(userController.path).toEqual('/users');
  });

  it('should create router property', () => {
    expect(userController.router).toBeTruthy();
  });
});
