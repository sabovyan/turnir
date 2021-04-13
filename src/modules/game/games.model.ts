import { Participant } from '@prisma/client';
import { Game, Prisma } from '.prisma/client';
import prisma from '../../lib/prismaClient';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types/main';

import { IUpdateParticipants, IAdjustedGame } from './games.types';

interface ICreateGameArgs {
  participants: IAdjustedGame;
  nextGameId: number | null;
  nextGamePosition: number;
  roundId?: number;
}

export interface IGameModel {
  create: FunctionTypeWithPromiseResult<ICreateGameArgs, Game>;
  updateGameParticipants: FunctionTypeWithPromiseResult<
    IUpdateParticipants,
    boolean
  >;

  deleteById: FunctionTypeWithPromiseResult<
    OnlyId,
    Game & {
      participant1: Participant | null;
      participant2: Participant | null;
    }
  >;
}

class GameModel implements IGameModel {
  instance: Prisma.GameDelegate<false>;

  constructor() {
    this.instance = prisma.game;
  }

  async create({
    nextGameId,
    nextGamePosition,
    participants: { participant1, participant2 },
    roundId,
  }: ICreateGameArgs) {
    const game = await this.instance.create({
      data: {
        participant1,
        participant2,
        nextGamePosition,
        nextGame: nextGameId
          ? {
              connect: {
                id: nextGameId,
              },
            }
          : undefined,
        round: roundId
          ? {
              connect: {
                id: roundId,
              },
            }
          : undefined,
      },
    });

    return game;
  }

  async updateGameParticipants({
    gameId,
    participant1Id,
    participant2Id,
  }: IUpdateParticipants) {
    const game = await this.instance.update({
      where: {
        id: gameId,
      },
      data: {
        participant1: participant1Id
          ? {
              connect: {
                id: participant1Id || undefined,
              },
            }
          : undefined,
        participant2: participant2Id
          ? {
              connect: {
                id: participant2Id || undefined,
              },
            }
          : undefined,
      },
    });

    return !!game;
  }

  async deleteById({ id }: OnlyId) {
    const game = await this.instance.delete({
      where: {
        id,
      },
      include: {
        participant1: true,
        participant2: true,
      },
    });

    return game;
  }
}

const gameModel = new GameModel();

export default gameModel;
