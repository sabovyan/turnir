import { Player, PlayerGroup } from '@prisma/client';
import prisma from '../../lib/prismaClient';

interface IPlayerGroupModal {
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
  // update: () => {};
  // delete: () => {};
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
}

const playerGroupModel = new PlayerGroupsModel();

export default playerGroupModel;
