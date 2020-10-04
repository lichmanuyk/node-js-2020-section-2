import { Logger } from 'winston';

import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserRepository {
  constructor(private logger: Logger) {}

  async getUsers(limit?: number, loginSubstr: string = ''): Promise<User[]> {
    try {
      const users = await User.findAll({
        where: { isDeleted: false },
        order: [['login', 'ASC']],
        limit,
        raw: true,
      });
      return users;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: { id, isDeleted: false },
      });
      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async createUser(user: UserModel): Promise<string> {
    try {
      const newUser = await User.create(user);
      return newUser.id;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateUser(user: UserModel): Promise<User> {
    try {
      await User.update(user, {
        where: { id: user.id, isDeleted: false },
      });
      const updatedUser = await this.getUserById(user.id);
      return updatedUser;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const code = await User.update(
        { isDeleted: true },
        {
          where: { id, isDeleted: false },
        }
      );

      if (code[0] === 0) {
        throw new Error('This user is already deleted');
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
