import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { User } from './user.interface';

export class UserService {
  private users: User[];

  // http://localhost:8080/users?substring=aaa&limit=3
  getUsers(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const subString = req.query.substring ? String(req.query.substring) : '';
    const userItems = this.users
      .filter((user) => user.login.includes(subString) && !user.isDeleted)
      .sort((a, b) => (a.login < b.login ? -1 : a.login > b.login ? 1 : 0))
      .slice(0, limit);

    res.json({ userItems });
  }

  getUserById(req: Request, res: Response) {
    const userItems = this.users.find(
      (user) => user.id === req.params.id && !user.isDeleted
    );

    if (!userItems) {
      res.status(404);
      return res.send('There is no user with such id or it was deleted');
    }

    res.json({ userItems });
  }

  createUser(req: Request, res: Response) {
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

  updateUser(req: Request, res: Response) {
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

  deleteUser(req: Request, res: Response) {
    const userIndex = this.users.findIndex(
      (user) => user.id === req.params.id && !user.isDeleted
    );

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
