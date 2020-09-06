import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserRepository {
  async getUsers(limit?: number, loginSubstr: string = '') {
    try {
      const users = await User.findAll({
        where: { isDeleted: false },
        order: [['login', 'ASC']],
        limit,
      });
      return users.map((user) => user.toJSON());
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await User.findOne({
        where: { id, isDeleted: false },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(user: UserModel) {
    try {
      const newUser = await User.create(user);
      return newUser.id;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(user: UserModel) {
    try {
      await User.update(user, {
        where: { id: user.id, isDeleted: false },
      });
      const updatedUser = await User.findOne({
        where: { id: user.id },
      });
      return updatedUser.toJSON();
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      await User.update(
        { isDeleted: true },
        {
          where: { id, isDeleted: false },
        }
      );
    } catch (err) {
      throw err;
    }
  }
}
