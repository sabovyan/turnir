import { Prisma } from '.prisma/client';
import prisma from '../../lib/prismaClient';
import {
  FunctionTypeWithPromiseResult,
  GameInstance,
  OnlyId,
} from '../../types';

import {
  GameWithParticipants,
  IAdjustedParticipantPair,
  IUpdateGameScore,
} from './game.types';

interface ICreateGameArgs {
  participants: IAdjustedParticipantPair;
  nextGameId: number | null;
  nextGamePosition: number;
  roundId?: number;
}

interface IUpdateParticipant {
  participantId: number;
  gameId: number;
}
interface IUpdateSemifinalGameArgs {
  gameId: number;
  thirdPlaceGameId: number;
}

export interface IGameModel {
  create: FunctionTypeWithPromiseResult<ICreateGameArgs, GameInstance>;

  connectThirdPlaceGame: FunctionTypeWithPromiseResult<
    IUpdateSemifinalGameArgs,
    GameInstance
  >;
  updateGameScore: FunctionTypeWithPromiseResult<
    IUpdateGameScore,
    GameInstance
  >;
  updateCompletionStatus: FunctionTypeWithPromiseResult<OnlyId, GameInstance>;
  updateFirstParticipant: FunctionTypeWithPromiseResult<
    IUpdateParticipant,
    GameInstance
  >;

  updateSecondParticipant: FunctionTypeWithPromiseResult<
    IUpdateParticipant,
    GameInstance
  >;

  deleteById: FunctionTypeWithPromiseResult<OnlyId, GameWithParticipants>;

  findByNextGameId: FunctionTypeWithPromiseResult<OnlyId, GameInstance[]>;

  getById: FunctionTypeWithPromiseResult<OnlyId, GameInstance | null>;
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

  async findByNextGameId({ id }: OnlyId) {
    const games = await this.instance.findMany({
      where: {
        nextGameId: id,
      },
    });

    return games;
  }

  async getById({ id }: OnlyId) {
    const game = await this.instance.findFirst({
      where: {
        id,
      },
    });

    return game;
  }

  async updateCompletionStatus({ id }: OnlyId) {
    const game = await this.instance.update({
      where: {
        id,
      },
      data: {
        isCompleted: true,
      },
    });

    return game;
  }

  async updateFirstParticipant({ gameId, participantId }: IUpdateParticipant) {
    const game = await this.instance.update({
      where: {
        id: gameId,
      },
      data: {
        participant1: {
          connect: {
            id: participantId,
          },
        },
      },
    });

    return game;
  }

  async updateSecondParticipant({ gameId, participantId }: IUpdateParticipant) {
    const game = await this.instance.update({
      where: {
        id: gameId,
      },
      data: {
        participant2: {
          connect: {
            id: participantId,
          },
        },
      },
    });

    return game;
  }

  async updateGameScore({
    gameId,
    firstParticipantScore,
    secondParticipantScore,
  }: IUpdateGameScore) {
    const game = await this.instance.update({
      where: {
        id: gameId,
      },
      data: {
        firstParticipantScore,
        secondParticipantScore,
        isCompleted: true,
      },
    });

    return game;
  }

  async connectThirdPlaceGame({
    gameId,
    thirdPlaceGameId,
  }: IUpdateSemifinalGameArgs) {
    const game = await this.instance.update({
      where: {
        id: gameId,
      },
      data: {
        thirdPlaceGame: {
          connect: {
            id: thirdPlaceGameId,
          },
        },
      },
    });
    return game;
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
