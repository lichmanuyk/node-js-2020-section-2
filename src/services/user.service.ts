import {
  sequelize,
  UserGroupRepository,
  UserRepository,
} from '../data-access/index';
import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userGroupRepository: UserGroupRepository
  ) {}

  // http://localhost:8080/users?substring=aaa&limit=3
  async getUsers(loginSubstring?: string, limit?: number): Promise<User[]> {
    try {
      const users = await this.userRepository.getUsers(limit, loginSubstring);
      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.getUserById(userId);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(userData: UserModel): Promise<string> {
    try {
      const id = await this.userRepository.createUser({
        login: userData.login,
        password: userData.password,
        age: userData.age,
        isDeleted: false,
      });
      return id;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, userData: UserModel): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUser({
        id,
        ...userData,
      });
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.userRepository.deleteUser(userId, transaction);
      await this.userGroupRepository.deleteUserGroupAfterUser(userId, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
