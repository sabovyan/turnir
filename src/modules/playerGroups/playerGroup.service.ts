import { Player, PlayerGroup } from '@prisma/client';
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
import playerGroupModal, { IPlayerGroupModal } from './playerGroups.modal';

interface IPlayerGroupService {
  getAllGroups: (userId: string) => Promise<PlayerGroup[]>;
  getGroupByGroupId: (
    group: number | string,
  ) => Promise<
    | (PlayerGroup & {
        players: Player[];
      })
    | null
  >;
  deleteGroupById: (group: number | string) => Promise<PlayerGroup | null>;
  createNewGroup: (data: {
    userId: number;
    name: string;
  }) => Promise<PlayerGroup>;

  updateGroupNameById: (
    data: UpdateGroupNameRequest,
  ) => Promise<
    | (PlayerGroup & {
        players: Player[];
      })
    | null
  >;

  updateManyPlayersConnectionInGroup: (
    data: UpdateManyPlayersOfGroupRequest,
  ) => Promise<PlayerGroup>;

  updateOnePlayersConnectionToGroup: (
    data: updateOnePlayersConnectionToAGroupRequest,
  ) => Promise<PlayerGroup>;

  disconnectPlayerById: (
    data: DisconnectPlayersRequest,
  ) => Promise<PlayerGroup>;
}

class PlayerGroupService implements IPlayerGroupService {
  private groupModel: IPlayerGroupModal;

  constructor() {
    this.groupModel = playerGroupModal;
  }

  async createNewGroup(data: { userId: number; name: string }) {
    const group = await this.groupModel.createNewGroup(data);
    return group;
  }

  async getAllGroups(userId: string): Promise<PlayerGroup[]> {
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

const playerGroupService = new PlayerGroupService();

export default playerGroupService;
