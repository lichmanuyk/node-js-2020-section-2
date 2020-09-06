import { Router, Request, Response } from 'express';

import {
  JoiValidator,
  userPostSchema,
  uniqueLoginSchema,
} from '../validators/index';
import { UserService } from '../services/index';

export class UserController {
  public router = Router();
  public path = '/users';

  constructor(
    private validator: JoiValidator,
    private userService: UserService
  ) {
    this.initializeRoutes();
  }

  async initializeRoutes() {
    this.router.get(`${this.path}`, this.getUsers.bind(this));
    this.router.get(`${this.path}/:id`, this.getUserById.bind(this));
    this.router.post(
      `${this.path}`,
      this.validator.validateSchema(userPostSchema),
      await this.validator.validateUniqueSchema(uniqueLoginSchema),
      this.createUser.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.validator.validateSchema(userPostSchema),
      await this.validator.validateUniqueSchema(uniqueLoginSchema),
      this.updateUser.bind(this)
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser.bind(this));
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  private async getUsers(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const subString = req.query.substring ? String(req.query.substring) : '';
    try {
      const userItems = await this.userService.getUsers(subString, limit);
      res.json({ userItems });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  private async getUserById(req: Request, res: Response) {
    try {
      const userItems = await this.userService.getUserById(req.params.id);

      if (!userItems) {
        return res
          .status(404)
          .send('There is no user with such id or it was deleted');
      }

      res.json({ userItems });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  private async createUser(req: Request, res: Response) {
    try {
      const id = await this.userService.createUser(req.body);
      res.json({ id });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  private async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  private async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).json(err.message);
    }
  }
}
