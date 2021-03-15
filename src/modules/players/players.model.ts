import { Player, Prisma } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import {
  CreatePlayerProps,
  updatePlayerGroupRequest,
  UpdatePlayerRequest,
} from './player.type';

export interface IPlayerModel {
  createNewPlayer: (data: CreatePlayerProps) => Promise<Player>;
  getAllPlayers: (userId: number) => Promise<Player[]>;
  getPlayerByName: (userId: number, name: string) => Promise<Player | null>;
  deletePlayerById: (playerId: number) => Promise<Player>;
  updatePlayerName: (data: UpdatePlayerRequest) => Promise<Player>;
  updatePlayerGroup: (data: updatePlayerGroupRequest) => Promise<Player>;
  // get: () => {};
  // update: () => {};
  // deleteAll: () => {};
}

class PlayerModel implements IPlayerModel {
  instance: Prisma.PlayerDelegate<false>;

  constructor() {
    this.instance = prisma.player;
  }

  async createNewPlayer({ name, userId }: CreatePlayerProps): Promise<Player> {
    const player = await this.instance.create({
      data: {
        name,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return player;
  }

  async getAllPlayers(userId: number) {
    const players = await this.instance.findMany({
      where: {
        userId,
      },
    });

    return players;
  }

  async getPlayerByName(userId: number, name: string) {
    const player = await this.instance.findFirst({
      where: {
        name,
        userId,
      },
    });
    return player;
  }

  async deletePlayerById(id: number) {
    const response = this.instance.delete({
      where: {
        id,
      },
    });

    return response;
  }

  async updatePlayerName({ id, name }: UpdatePlayerRequest) {
    const player = await this.instance.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return player;
  }

  async updatePlayerGroup({ groupId, playerId }: updatePlayerGroupRequest) {
    const player = await this.instance.update({
      where: {
        id: playerId,
      },

      data: {
        groups: {
          connect: {
            id: groupId,
          },
        },
      },
      include: {
        groups: true,
      },
    });

    return player;
  }
}

const playerModel = new PlayerModel();

export default playerModel;
