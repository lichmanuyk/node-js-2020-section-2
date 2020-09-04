import { v4 as uuid } from 'uuid';

import { UserRepository } from '../data-access/index';

export class UserService {

  constructor(private userRepository: UserRepository) {}

  // http://localhost:8080/users?substring=aaa&limit=3
  async getUsers(loginSubstring?: string, limit?: number) {
    const users = await this.userRepository.getUsers(limit, loginSubstring);
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    return user;
  }

  async createUser(userData: any) {
    const id = uuid();
    await this.userRepository.createUser({
      login: userData.login,
      password: userData.password,
      age: userData.age,
      isDeleted: false,
      id
    });
    return id;
  }

  async updateUser(id: string, userData: any) {
    const updatedUser = await this.userRepository.updateUser({id, ...userData});
    return updatedUser;

    // const userIndex = this.users.findIndex(
    //   (user) => user.id === userId && !user.isDeleted
    // );

    // if (userIndex === -1) {
    //   return;
    // }

    // this.users[userIndex] = {
    //   ...this.users[userIndex],
    //   login: userData.login,
    //   password: userData.password,
    //   age: userData.age,
    // };
  }

  async deleteUser(userId: string) {
    await this.userRepository.deleteUser(userId);
    return true;

    // let isDeleted = true;
    // const userIndex = this.users.findIndex(
    //   (user) => user.id === userId && !user.isDeleted
    // );

    // if (userIndex === -1) {
    //   isDeleted = false;
    //   return isDeleted;
    // }

    // this.users[userIndex].isDeleted = true;
    // return isDeleted;
  }

}
