import { v4 as uuid } from 'uuid';

import { UserModel } from '../types/index';
import { UserRepository } from '../data-access/index';

export class UserService {
  private users: UserModel[];

  constructor(private userRepository: UserRepository) {
    this.users = [];
  }

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users;
    // return [...users];
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  async getUsers(loginSubstring: string, limit: number) {
    return await this.userRepository.getAllUsers();
    // const userItems = this.users
    //   .filter((user) => user.login.includes(loginSubstring) && !user.isDeleted)
    //   .sort((a, b) => (a.login < b.login ? -1 : a.login > b.login ? 1 : 0))
    //   .slice(0, limit);

    // return userItems;
  }

  getUserById(userId: string): UserModel {
    const userItem = this.users.find(
      (user) => user.id === userId && !user.isDeleted
    );

    return userItem;
  }

  async createUser(userData: any) {
    const id = uuid();
    return await this.userRepository.createUser({
      login: userData.login,
      password: userData.password,
      age: userData.age,
      isDeleted: false,
      id,
    });
    // this.users.push({
    //   login: userData.login,
    //   password: userData.password,
    //   age: userData.age,
    //   isDeleted: false,
    //   id,
    // });
  }

  updateUser(userId: string, userData: any): UserModel {
    const userIndex = this.users.findIndex(
      (user) => user.id === userId && !user.isDeleted
    );

    if (userIndex === -1) {
      return;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      login: userData.login,
      password: userData.password,
      age: userData.age,
    };
    return this.users[userIndex];
  }

  deleteUser(userId: string): boolean {
    let isDeleted = true;
    const userIndex = this.users.findIndex(
      (user) => user.id === userId && !user.isDeleted
    );

    if (userIndex === -1) {
      isDeleted = false;
      return isDeleted;
    }

    this.users[userIndex].isDeleted = true;
    return isDeleted;
  }

}
