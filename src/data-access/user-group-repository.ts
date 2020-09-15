import { Transaction } from 'sequelize/types';

import { Group, User, UserGroup } from '../models/index';

export class UserGroupRepository {
  constructor() {
    Group.belongsToMany(User, {
      through: UserGroup,
      as: 'users',
      foreignKey: 'userId',
      otherKey: 'groupId',
    });
    User.belongsToMany(Group, {
      through: UserGroup,
      as: 'userGroups',
      foreignKey: 'userId',
      otherKey: 'groupId',
    });
  }

  async addUsersToGroup(groupId: string, userIds: string[]): Promise<void> {
    try {
      userIds.forEach(
        async (userId) =>
          await UserGroup.create({
            userId,
            groupId,
          })
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteUserGroupAfterUser(userId: string, transaction: Transaction): Promise<void> {
    try {
        await UserGroup.destroy({
            where: {
                userId
            },
            transaction
        });
    } catch (err) {
      throw err;
    }
  }

  async deleteUserGroupAfterGroup(groupId: string, transaction: Transaction): Promise<void> {
    try {
        await UserGroup.destroy({
            where: {
                groupId
            },
            transaction
        });
    } catch (err) {
      throw err;
    }
  }
}
