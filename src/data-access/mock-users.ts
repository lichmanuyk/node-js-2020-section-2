import { UserModel } from '../types/index';
import { v4 as uuid } from 'uuid';

export const MOCK_USERS: UserModel[] = [
  {
    id: uuid(),
    login: 'Peter',
    password: '12345',
    age: 18,
    isDeleted: false,
  },
  {
    id: uuid(),
    login: 'Olga',
    password: '85859',
    age: 25,
    isDeleted: false,
  },
];
