import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserRepository {
  async getUsers(limit?: number, loginSubstr: string = '') {
    const users = await User.findAll({
      limit,
    });
    return JSON.parse(JSON.stringify(users));
  }

  async getUserById(id: string) {
    const user = await User.findOne({
      where: { id, isDeleted: false }
    });
    return user;
  }

  async getAllUsers() {
    const users = await User.findAll();
    // console.log(JSON.parse(JSON.stringify(users)))
    // const mappedUsers = users.map(user => user.dataValues())
    return JSON.parse(JSON.stringify(users));
  }

  async createUser(user: UserModel) {
    const newUser = await User.create(user);
    return newUser.id;
  }

  async updateUser(user: UserModel) {
    const dbUser = await User.findOne({
      where: {id: user.id, isDeleted: false}
    });
    dbUser.login = user.login;
    dbUser.password = user.password;
    dbUser.age = user.age;
    await dbUser.save();
    return JSON.parse(JSON.stringify(dbUser));
  }

  async deleteUser(id: string) {
    const dbUser = await User.findOne({
      where: {id, isDeleted: false}
    });
    dbUser.isDeleted = true;
    await dbUser.save();
    return;
  }
}
