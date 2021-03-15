import { Player, Group } from '@prisma/client';
import BadRequestError from '../../errors/BadRequestError';
import isStringNumeric from '../../utils/isStringNumeric';
import {
  DisconnectPlayersRequest,
  UpdateGroupNameRequest,
  UpdateManyPlayersOfGroupRequest,
  updateOnePlayersConnectionToAGroupRequest,
} from './group.type';
import {
  validateAddMultiplePlayers,
  validateFieldsForDisconnect,
  validateGroupNameUpdateFields,
} from './group.utils';
import groupModal, { IGroupModal } from './group.model';

interface IGroupService {
  getAllGroups: (userId: string) => Promise<Group[]>;
  getGroupByGroupId: (
    group: number | string,
  ) => Promise<
    | (Group & {
        players: Player[];
      })
    | null
  >;
  deleteGroupById: (group: number | string) => Promise<Group | null>;
  createNewGroup: (data: { userId: number; name: string }) => Promise<Group>;

  updateGroupNameById: (
    data: UpdateGroupNameRequest,
  ) => Promise<
    | (Group & {
        players: Player[];
      })
    | null
  >;

  updateManyPlayersConnectionInGroup: (
    data: UpdateManyPlayersOfGroupRequest,
  ) => Promise<Group>;

  updateOnePlayersConnectionToGroup: (
    data: updateOnePlayersConnectionToAGroupRequest,
  ) => Promise<Group>;

  disconnectPlayerById: (data: DisconnectPlayersRequest) => Promise<Group>;
}

class GroupService implements IGroupService {
  private groupModel: IGroupModal;

  constructor() {
    this.groupModel = groupModal;
  }

  async createNewGroup(data: { userId: number; name: string }) {
    const group = await this.groupModel.createNewGroup(data);
    return group;
  }

  async getAllGroups(userId: string): Promise<Group[]> {
    if (!userId || !isStringNumeric(userId))
      throw new BadRequestError('invalid credentials');

    const groups = await this.groupModel.getAllGroups(Number(userId));
    return groups;
  }

  async getGroupByGroupId(groupId: number | string) {
    if (Number.isNaN(groupId))
      throw new BadRequestError('your id must be be a number');

    const id = Number(groupId);

    const group = await this.groupModel.getGroupByGroupId(id);
    return group;
  }

  async deleteGroupById(groupId: number | string) {
    if (Number.isNaN(groupId))
      throw new BadRequestError('your id must be be a number');

    const id = Number(groupId);

    const group = await this.groupModel.deleteGroupById(id);

    return group;
  }

  async updateGroupNameById({ groupId, userId, name }: UpdateGroupNameRequest) {
    await validateGroupNameUpdateFields(groupId, userId, name);

    const group = await this.groupModel.updateGroupNameById({
      groupId,
      userId,
      name,
    });

    return group;
  }

  async updateManyPlayersConnectionInGroup(
    data: UpdateManyPlayersOfGroupRequest,
  ) {
    await validateAddMultiplePlayers(data);

    const group = await this.groupModel.updateManyPlayersConnectionInGroup(
      data,
    );

    return group;
  }

  async updateOnePlayersConnectionToGroup(
    data: updateOnePlayersConnectionToAGroupRequest,
  ) {
    /* validate */

    const group = await this.groupModel.updateOnePlayersConnectionToGroup(data);

    return group;
  }

  async disconnectPlayerById({ groupId, playerId }: DisconnectPlayersRequest) {
    await validateFieldsForDisconnect({ groupId, playerId });

    const group = await this.groupModel.disconnectPlayerById({
      groupId,
      playerId,
    });
    return group;
  }
}

const groupService = new GroupService();

export default groupService;
