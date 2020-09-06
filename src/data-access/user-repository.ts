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
      return JSON.parse(JSON.stringify(users));
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
      const dbUser = await User.findOne({
        where: { id: user.id, isDeleted: false },
      });

      dbUser.login = user.login;
      dbUser.password = user.password;
      dbUser.age = user.age;
      await dbUser.save();

      return JSON.parse(JSON.stringify(dbUser));
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      const dbUser = await User.findOne({
        where: { id, isDeleted: false },
      });
      dbUser.isDeleted = true;
      await dbUser.save();
    } catch (err) {
      throw err;
    }
  }
}
