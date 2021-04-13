import { Game, Prisma, Round } from '.prisma/client';
import prisma from '../../lib/prismaClient';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types/main';

interface IRoundCreateArgs {
  name: string;
  games: Game[];
}

export interface IRoundModel {
  create: FunctionTypeWithPromiseResult<IRoundCreateArgs, Round>;
  deleteById: FunctionTypeWithPromiseResult<
    OnlyId,
    Round & {
      games: Game[];
    }
  >;
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
