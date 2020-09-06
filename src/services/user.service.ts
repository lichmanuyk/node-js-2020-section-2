import { UserRepository } from '../data-access/index';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  // http://localhost:8080/users?substring=aaa&limit=3
  async getUsers(loginSubstring?: string, limit?: number) {
    try {
      const users = await this.userRepository.getUsers(limit, loginSubstring);
      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(userData: any) {
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

  async updateUser(id: string, userData: any) {
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

  async deleteUser(userId: string) {
    try {
      await this.userRepository.deleteUser(userId);
    } catch (err) {
      throw err;
    }
  }
}
