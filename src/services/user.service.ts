import { Logger } from 'winston';
import {
  UserGroupRepository,
  UserRepository,
} from '../data-access/index';
import { User } from '../models/index';
import { UserModel } from '../types/index';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userGroupRepository: UserGroupRepository,
    private logger: Logger
  ) {}

  // http://localhost:8080/users?substring=aaa&limit=3
  async getUsers(loginSubstring?: string, limit?: number): Promise<User[]> {
    this.logger.info('Method: getUsers()', [{ service: 'UserService' }, { arguments }]);
    try {
      const users = await this.userRepository.getUsers(limit, loginSubstring);
      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.info('Method: getUserById()', [{ service: 'UserService' }, { arguments }]);
    try {
      const user = await this.userRepository.getUserById(userId);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(userData: UserModel): Promise<string> {
    this.logger.info('Method: createUser()', [{ service: 'UserService' }, { arguments }]);
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
    this.logger.info('Method: updateUser()', [{ service: 'UserService' }, { arguments }]);
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
    this.logger.info('Method: deleteUser()', [{ service: 'UserService' }, { arguments }]);
    try {
      await this.userRepository.deleteUser(userId);
      await this.userGroupRepository.deleteUserGroupAfterUser(userId);
    } catch (err) {
      throw err;
    }
  }
}
