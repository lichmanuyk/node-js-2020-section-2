import { Logger } from 'winston';
import {
  GroupRepository,
  sequelize,
  UserGroupRepository,
} from '../data-access/index';
import { Group } from '../models/index';
import { GroupModel } from '../types/index';

export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private userGroupRepository: UserGroupRepository,
    private logger: Logger
  ) {}

  async getGroups(): Promise<Group[]> {
    this.logger.info('Method: getGroups()', [{ service: 'GroupService' }, { arguments }]);
    try {
      const groups = await this.groupRepository.getGroups();
      return groups;
    } catch (err) {
      throw err;
    }
  }

  async getGroupById(groupId: string): Promise<Group> {
    this.logger.info('Method: getGroupById()', [{ service: 'GroupService' }, { arguments }]);
    try {
      const group = await this.groupRepository.getGroupById(groupId);
      return group;
    } catch (err) {
      throw err;
    }
  }

  async createGroup(groupData: GroupModel): Promise<string> {
    this.logger.info('Method: createGroup()', [{ service: 'GroupService' }, { arguments }]);
    try {
      const id = await this.groupRepository.createGroup({
        name: groupData.name,
        permissions: groupData.permissions,
      });
      return id;
    } catch (err) {
      throw err;
    }
  }

  async updateGroup(id: string, groupData: GroupModel): Promise<Group> {
    this.logger.info('Method: updateGroup()', [{ service: 'GroupService' }, { arguments }]);
    try {
      const updatedGroup = await this.groupRepository.updateGroup({
        id,
        ...groupData,
      });
      return updatedGroup;
    } catch (err) {
      throw err;
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    this.logger.info('Method: deleteGroup()', [{ service: 'GroupService' }, { arguments }]);
    try {
      await this.groupRepository.deleteGroup(groupId);
      await this.userGroupRepository.deleteUserGroupAfterGroup(
        groupId,
      );
    } catch (err) {
      throw err;
    }
  }
}
