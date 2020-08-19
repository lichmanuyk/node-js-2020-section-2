import { Router } from 'express';

import { User } from './user.interface';
import { userPostSchema, uniqueLoginSchema } from './user.post.schema';
import { JoiValidator } from '../validator';
import { UserService } from './user.service';

export class UserController {
  public router = Router();
  public path = '/users';
  private users: User[];

  constructor(
    private validator: JoiValidator,
    private userService: UserService
  ) {
    this.users = [];
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.userService.getUsers.bind(this));
    this.router.get(
      `${this.path}/:id`,
      this.userService.getUserById.bind(this)
    );
    this.router.post(
      `${this.path}`,
      this.validator.validateSchema(userPostSchema),
      this.validator.validateUniqueSchema(uniqueLoginSchema, this.users),
      this.userService.createUser.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.validator.validateSchema(userPostSchema),
      this.validator.validateUniqueSchema(uniqueLoginSchema, this.users),
      this.userService.updateUser.bind(this)
    );
    this.router.delete(
      `${this.path}/:id`,
      this.userService.deleteUser.bind(this)
    );
  }
}
