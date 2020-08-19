import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { User } from './user.interface';
import { userPostSchema, uniqueLoginSchema } from './users.post.schema';
import { JoiValidator } from '../validator';

export class UserController {
  public router = Router();
  public path = '/users';
  private users: User[];

  constructor(private validator: JoiValidator) {
    this.users = [];
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.getUsers.bind(this));
    this.router.get(`${this.path}/:id`, this.getUserById.bind(this));
    this.router.post(
      `${this.path}`,
      this.validator.validateSchema(userPostSchema),
      this.validator.validateUniqueSchema(uniqueLoginSchema, this.users),
      this.createUser.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.validator.validateSchema(userPostSchema),
      this.validator.validateUniqueSchema(uniqueLoginSchema, this.users),
      this.updateUser.bind(this)
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser.bind(this));
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  private getUsers(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const subString = req.query.substring ? String(req.query.substring) : '';
    const userItems = this.getAutoSuggestUsers(subString, limit);

    res.json({ userItems });
  }

  private getUserById(req: Request, res: Response) {
    const userItems = this.users.find(
      (user) => user.id === req.params.id && !user.isDeleted
    );

    if (!userItems) {
      res.status(404);
      return res.send('There is no user with such id or it was deleted');
    }

    res.json({ userItems });
  }

  private createUser(req: Request, res: Response) {
    const id = uuid();
    this.users.push({
      login: req.body.login,
      password: req.body.password,
      age: req.body.age,
      isDeleted: false,
      id,
    });
    res.json({ id });
  }

  private updateUser(req: Request, res: Response) {
    const userIndex = this.users.findIndex(
      (user) => user.id === req.params.id && !user.isDeleted
    );

    if (userIndex === -1) {
      res.status(404);
      return res.send('There is no user with such id or it was deleted');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      login: req.body.login,
      password: req.body.password,
      age: req.body.age,
    };
    res.json(this.users[userIndex]);
  }

  private deleteUser(req: Request, res: Response) {
    const userIndex = this.users.findIndex((user) => user.id === req.params.id);

    if (userIndex === -1) {
      res.status(404);
      return res.send('No user with such id');
    }

    this.users[userIndex].isDeleted = true;
    res.sendStatus(204);
  }

  private getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
    const userItems = this.users
      .filter((user) => user.login.includes(loginSubstring) && !user.isDeleted)
      .sort((a, b) => (a.login < b.login ? -1 : a.login > b.login ? 1 : 0))
      .slice(0, limit);
    return userItems;
  }
}
