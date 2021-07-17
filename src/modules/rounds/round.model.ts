import { Game, Prisma } from '.prisma/client';
import prisma from '../../lib/prismaClient';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types';
import { RoundWithGames } from './Round.type';

interface IRoundCreateArgs {
  name: string;
  games: Game[];
}

export interface IRoundModel {
  create: FunctionTypeWithPromiseResult<IRoundCreateArgs, RoundWithGames>;

  getById: FunctionTypeWithPromiseResult<OnlyId, RoundWithGames | null>;

  getAllByTournamentId: FunctionTypeWithPromiseResult<OnlyId, RoundWithGames[]>;

  deleteById: FunctionTypeWithPromiseResult<OnlyId, RoundWithGames>;
}

class RoundModel implements IRoundModel {
  instance: Prisma.RoundDelegate<false>;

  constructor() {
    this.instance = prisma.round;
  }

  async create({ name, games }: IRoundCreateArgs) {
    const round = await this.instance.create({
      data: {
        name,
        games: {
          connect: games.map((g) => ({ id: g.id })),
        },
      },
      include: {
        games: true,
      },
    });

    return round;
  }

  async getById({ id }: OnlyId) {
    const round = await this.instance.findUnique({
      where: {
        id,
      },
      include: {
        games: true,
      },
    });

    return round;
  }

  async getAllByTournamentId({ id }: OnlyId) {
    const rounds = await this.instance.findMany({
      where: {
        tournamentId: id,
      },
      include: {
        games: true,
      },
    });

    return rounds;
  }

  async deleteById({ id }: OnlyId) {
    const round = await this.instance.delete({
      where: {
        id,
      },
      include: {
        games: true,
      },
    });

    return round;
  }
}

const roundModel = new RoundModel();

export default roundModel;
