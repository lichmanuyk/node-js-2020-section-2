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
      await this.validator.validateUniqueSchema(
        uniqueLoginSchema
      ),
      this.createUser.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.validator.validateSchema(userPostSchema),
      await this.validator.validateUniqueSchema(
        uniqueLoginSchema
      ),
      this.updateUser.bind(this)
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser.bind(this));
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  private async getUsers(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const subString = req.query.substring ? String(req.query.substring) : '';
    const userItems = await this.userService.getUsers(subString, limit);

    res.json({ userItems });
  }

  private  async getUserById(req: Request, res: Response) {
    const userItems = await this.userService.getUserById(req.params.id);

    if (!userItems) {
      res.status(404);
      return res.send('There is no user with such id or it was deleted');
    }

    res.json({ userItems });
  }

  private async createUser(req: Request, res: Response) {
    const id = await this.userService.createUser(req.body);
    res.json({ id });
  }

  private async updateUser(req: Request, res: Response) {
    const updatedUser = await this.userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      res.status(404);
      return res.send('There is no user with such id or it was deleted');
    }
    res.json(updatedUser);
  }

  private async deleteUser(req: Request, res: Response) {
    const isDeleted = await this.userService.deleteUser(req.params.id);

    if (!isDeleted) {
      res.status(404);
      return res.send('No user with such id');
    }

    res.sendStatus(204);
  }
}
