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
    private userGroupRepository: UserGroupRepository
  ) {}

  async getGroups(): Promise<Group[]> {
    try {
      const groups = await this.groupRepository.getGroups();
      return groups;
    } catch (err) {
      throw err;
    }
  }

  async getGroupById(groupId: string): Promise<Group> {
    try {
      const group = await this.groupRepository.getGroupById(groupId);
      return group;
    } catch (err) {
      throw err;
    }
  }

  async createGroup(groupData: GroupModel): Promise<string> {
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
