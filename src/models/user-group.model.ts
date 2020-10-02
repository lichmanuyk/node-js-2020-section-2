import { DataTypes, Model } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { UserGroupModel } from '../types/index';
import { sequelize } from '../data-access/index';

export class UserGroup extends Model implements UserGroupModel {
    id: string;
    userId: string;
    groupId:string;
  }

  UserGroup.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuid
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
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