import { Player, Prisma } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import { CreatePlayerProps } from './player.type';

export interface IPlayerModel {
  createNewPlayer: (data: CreatePlayerProps) => Promise<Player>;
  getAllPlayers: (userId: number) => Promise<Player[]>;
  getPlayerByName: (userId: number, name: string) => Promise<Player | null>;
  // get: () => {};
  // update: () => {};
  // delete: () => {};
  // deleteAll: () => {};
}

class PlayerModel implements IPlayerModel {
  model: Prisma.PlayerDelegate;
  constructor() {
    this.model = prisma.player;
  }

  // eslint-disable-next-line class-methods-use-this
  async createNewPlayer({ name, userId }: CreatePlayerProps): Promise<Player> {
    const player = await prisma.player.create({
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

  // eslint-disable-next-line class-methods-use-this
  async getAllPlayers(userId: number) {
    const players = await prisma.player.findMany({
      where: {
        userId,
      },
    });

    return players;
  }

  async getPlayerByName(userId: number, name: string) {
    const player = await this.model.findFirst({
      where: {
        name,
        userId,
      },
    });
    return player;
  }
}

const playerModel = new PlayerModel();

export default playerModel;
