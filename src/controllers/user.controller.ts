import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

import {
  UserJoiValidator,
  userPostSchema,
  uniqueUserLoginSchema,
} from '../validators/index';
import { UserService } from '../services/index';

export class UserController {
  public router = Router();
  public path = '/users';

  constructor(
    private validator: UserJoiValidator,
    private userService: UserService,
    private logger: Logger,
    private authMiddleware: (req: Request, res: Response, next: NextFunction) => void
  ) {
    this.initializeRoutes();
  }

  async initializeRoutes() {
    this.router.get(`${this.path}`, this.authMiddleware,  this.getUsers.bind(this));
    this.router.get(`${this.path}/:id`, this.authMiddleware, this.getUserById.bind(this));
    this.router.post(
      `${this.path}`,
      this.authMiddleware,
      this.validator.validateSchema(userPostSchema),
      await this.validator.validateUniqueSchema(uniqueUserLoginSchema),
      this.createUser.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.authMiddleware,
      this.validator.validateSchema(userPostSchema),
      await this.validator.validateUniqueSchema(uniqueUserLoginSchema),
      this.updateUser.bind(this)
    );
    this.router.delete(`${this.path}/:id`, this.authMiddleware, this.deleteUser.bind(this));
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  private async getUsers(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const subString = req.query.substring ? String(req.query.substring) : '';
    try {
      const userItems = await this.userService.getUsers(subString, limit);
      res.json({ userItems });
    } catch (err) {
      this.logger.error('Method: deleteGroup()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userItems = await this.userService.getUserById(req.params.id);

      if (!userItems) {
        res
          .status(404)
          .send('There is no user with such id or it was deleted');
        return;
      }

      res.json({ userItems });
    } catch (err) {
      this.logger.error('Method: getUserById()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    try {
      const id = await this.userService.createUser(req.body);
      res.json({ id });
    } catch (err) {
      this.logger.error('Method: createUser()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      res.json(updatedUser);
    } catch (err) {
      this.logger.error('Method: updateUser()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      this.logger.error('Method: deleteUser()', [{ arguments }, {message: err.message}]);
      res.status(404).json(err.message);
    }
  }
}
