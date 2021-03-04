import { Player, PlayerGroup } from '@prisma/client';
import { isThisTypeNode } from 'typescript';
import prisma from '../../lib/prismaClient';
import {
  DisconnectPlayersRequest,
  UpdateGroupNameRequest,
  UpdateManyPlayersOfGroupRequest,
  updateOnePlayersConnectionToAGroupRequest,
} from './group.type';

export interface IPlayerGroupModal {
  createNewGroup: (data: {
    name: string;
    userId: number;
  }) => Promise<PlayerGroup>;

  getAllGroups: (userId: number) => Promise<PlayerGroup[]>;
  getGroupByGroupId: (
    groupId: number,
  ) => Promise<
    | (PlayerGroup & {
        players: Player[];
      })
    | null
  >;
  deleteGroupById: (groupId: number) => Promise<PlayerGroup | null>;
  updateGroupNameById: ({
    groupId,
    userId,
    name,
  }: UpdateGroupNameRequest) => Promise<
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

  // update: () => {};
  // deleteAll: () => {};
}

class PlayerGroupsModel implements IPlayerGroupModal {
  // eslint-disable-next-line class-methods-use-this
  async createNewGroup(data: { name: string; userId: number }) {
    const group = await prisma.playerGroup.create({
      data: {
        name: data.name,
        User: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAllGroups(userId: number) {
    const groups = await prisma.playerGroup.findMany({
      where: {
        userId,
      },
      include: {
        players: true,
      },
    });

    return groups;
  }

  // eslint-disable-next-line class-methods-use-this
  async getGroupByGroupId(id: number) {
    const group = await prisma.playerGroup.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteGroupById(id: number) {
    const group = await prisma.playerGroup.delete({
      where: {
        id,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateGroupNameById({ groupId, name }: UpdateGroupNameRequest) {
    const group = await prisma.playerGroup.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },

      include: {
        players: true,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateManyPlayersConnectionInGroup({
    groupId,
    playerIds,
  }: UpdateManyPlayersOfGroupRequest) {
    const group = await prisma.playerGroup.update({
      where: {
        id: groupId,
      },
      data: {
        players: {
          connect: playerIds,
        },
      },
      include: {
        players: true,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOnePlayersConnectionToGroup(
    data: updateOnePlayersConnectionToAGroupRequest,
  ) {
    const group = await prisma.playerGroup.update({
      where: {
        id: data.groupId,
      },

      data: {
        players: {
          connect: {
            id: data.playerId,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async disconnectPlayerById({ groupId, playerId }: DisconnectPlayersRequest) {
    const group = await prisma.playerGroup.update({
      where: {
        id: groupId,
      },
      data: {
        players: {
          disconnect: {
            id: playerId,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return group;
  }
}

const playerGroupModel = new PlayerGroupsModel();

export default playerGroupModel;
