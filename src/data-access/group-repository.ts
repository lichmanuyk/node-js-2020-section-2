import { Logger } from 'winston';

import { Group } from '../models/index';
import { GroupModel } from '../types/index';

export class GroupRepository {
  constructor(private logger: Logger) {}

  async getGroups(): Promise<Group[]> {
    try {
      const groups = await Group.findAll({
        raw: true,
      });
      return groups;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getGroupById(id: string): Promise<Group> {
    try {
      const group = await Group.findOne({
        where: { id },
      });
      return group;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async createGroup(group: GroupModel): Promise<string> {
    try {
      const newGroup = await Group.create(group);
      return newGroup.id;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateGroup(group: GroupModel): Promise<Group> {
    try {
      await Group.update(group, {
        where: { id: group.id },
      });
      const updatedGroup = await this.getGroupById(group.id);
      return updatedGroup;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteGroup(id: string): Promise<void> {
    try {
      const code = await Group.destroy({
      });

      if (code === 0) {
        throw new Error('Group wasnt deleted or it is not existed');
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
