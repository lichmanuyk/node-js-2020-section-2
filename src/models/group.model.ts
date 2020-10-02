import { DataTypes, Model } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { GroupModel, Permission } from '../types/index';
import { sequelize } from '../data-access/index';

export class Group extends Model implements GroupModel {
    id: string;
    name: string;
    permissions: Permission[];
  }

  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuid
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      createdAt: false,
      updatedAt: false
    }
  );