import { Group, User, UserGroup } from '../models/index';
import { sequelize } from './database';

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
      const transaction = await sequelize.transaction();
      try {
        userIds.forEach(
          async (userId) =>
            await UserGroup.create(
              {
                userId,
                groupId,
              },
              { transaction }
            )
        );
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteUserGroupAfterUser(userId: string): Promise<void> {
    try {
      await UserGroup.destroy({
        where: {
          userId,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteUserGroupAfterGroup(groupId: string): Promise<void> {
    try {
      await UserGroup.destroy({
        where: {
          groupId,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
