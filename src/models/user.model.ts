import { Model } from 'sequelize';

import { User } from '../types/index';

export class UserModel extends Model implements User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}