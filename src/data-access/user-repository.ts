import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserRepository {
  constructor() {
    User.sync();
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async createUser(user: UserModel) {
    const newUser = await User.create(user);
    return newUser.id;
  }
}
