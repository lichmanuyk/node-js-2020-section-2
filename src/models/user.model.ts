import { Model, DataTypes } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { UserModel } from '../types/index';
import { sequelize } from '../data-access/index';

export class User extends Model implements UserModel {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuid
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
  }
);
