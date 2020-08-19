import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { User } from './user.interface';

export class UserService {
  users: User[];

  constructor() {
    this.users = [];
  }

  // http://localhost:8080/users?substring=aaa&limit=3
  getUsers(loginSubstring: string, limit: number): User[] {
    const userItems = this.users
      .filter((user) => user.login.includes(loginSubstring) && !user.isDeleted)
      .sort((a, b) => (a.login < b.login ? -1 : a.login > b.login ? 1 : 0))
      .slice(0, limit);

    return userItems;
  }

  getUserById(userId: string): User {
    const userItem = this.users.find(
      (user) => user.id === userId && !user.isDeleted
    );

    return userItem;
  }

  createUser(userData: any): string {
    const id = uuid();
    this.users.push({
      login: userData.login,
      password: userData.password,
      age: userData.age,
      isDeleted: false,
      id,
    });

    return id;
  }

  updateUser(userId: string, userData: any): User {
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
