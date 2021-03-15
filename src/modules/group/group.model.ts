import { Player, Group } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import {
  DisconnectPlayersRequest,
  UpdateGroupNameRequest,
  UpdateManyPlayersOfGroupRequest,
  updateOnePlayersConnectionToAGroupRequest,
} from './group.type';

type OrderType = 'asc' | 'desc';

const setAlphabeticalOrder = (type: OrderType) => ({
  orderBy: {
    name: type,
  },
});

export interface IGroupModal {
  createNewGroup: (data: { name: string; userId: number }) => Promise<Group>;

  getAllGroups: (userId: number) => Promise<Group[]>;
  getGroupByGroupId: (
    groupId: number,
  ) => Promise<
    | (Group & {
        players: Player[];
      })
    | null
  >;
  deleteGroupById: (groupId: number) => Promise<Group | null>;
  updateGroupNameById: ({
    groupId,
    userId,
    name,
  }: UpdateGroupNameRequest) => Promise<
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

  // update: () => {};
  // deleteAll: () => {};
}

class GroupModal implements IGroupModal {
  // eslint-disable-next-line class-methods-use-this
  async createNewGroup(data: { name: string; userId: number }) {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        User: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        players: setAlphabeticalOrder('asc'),
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAllGroups(userId: number) {
    const groups = await prisma.group.findMany({
      where: {
        userId,
      },
      include: {
        players: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    return groups;
  }

  // eslint-disable-next-line class-methods-use-this
  async getGroupByGroupId(id: number) {
    const group = await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        players: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteGroupById(id: number) {
    const group = await prisma.group.delete({
      where: {
        id,
      },
    });

    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateGroupNameById({ groupId, name }: UpdateGroupNameRequest) {
    const group = await prisma.group.update({
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
    const group = await prisma.group.update({
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
    const group = await prisma.group.update({
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
    const group = await prisma.group.update({
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

const groupModal = new GroupModal();

export default groupModal;
