import { Game, Participant, Prisma, Round, Tournament } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import {
  FunctionTypeWithPromiseResult,
  OnlyId,
  OnlyName,
  updateDataById,
} from '../../types/main';
import { ICreateTournamentData } from './tournament.type';

type getAllResponse = {
  name: string;
  goalsToWin: number;
  winningSets: number;
  createdAt: Date;
  rounds: Round[];
  id: number;
  tournamentTypeId: number;
};

export interface ITournamentModel {
  create: FunctionTypeWithPromiseResult<
    ICreateTournamentData,
    Tournament & {
      rounds: (Round & {
        games: (Game & {
          participant1: Participant | null;
          participant2: Participant | null;
        })[];
      })[];
    }
  >;
  getAll: FunctionTypeWithPromiseResult<
    OnlyId,
    {
      id: number;
      tournamentTypeId: number;
      name: string;
      createdAt: Date;
    }[]
  >;
  getById: FunctionTypeWithPromiseResult<OnlyId, Tournament | null>;
  updateById: FunctionTypeWithPromiseResult<updateDataById<any>, Tournament>;

  deleteById: FunctionTypeWithPromiseResult<
    OnlyId,
    Tournament & { rounds: Round[] }
  >;
}

class TournamentModel implements ITournamentModel {
  instance: Prisma.TournamentDelegate<false>;

  constructor() {
    this.instance = prisma.tournament;
  }

  async create({
    goalsToWin,
    tournamentTypeId,
    userId,
    winningSets,
    rounds,
    name,
  }: ICreateTournamentData) {
    const tournament = await this.instance.create({
      data: {
        winningSets,
        goalsToWin,
        name,
        User: {
          connect: {
            id: userId,
          },
        },
        tournamentType: {
          connect: {
            id: tournamentTypeId,
          },
        },
        rounds: {
          connect: rounds.map((r) => ({ id: r.id })),
        },
      },
      include: {
        rounds: {
          include: {
            games: {
              include: {
                participant1: true,
                participant2: true,
              },
            },
          },
        },
      },
    });

    return tournament;
  }

  async getAll({ id }: OnlyId) {
    const allTournaments = await this.instance.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        name: true,
        tournamentTypeId: true,
        createdAt: true,
        // winningSets: true,
        // goalsToWin: true,
        // rounds: {
        //   include: {
        //     game: {
        //       include: {
        //         participant1: true,
        //         participant2: true,
        //       },
        // },
        // },
        // },
      },
    });

    return allTournaments;
  }

  async getById({ id }: OnlyId) {
    const tournament = this.instance.findUnique({
      where: {
        id,
      },
      include: {
        rounds: {
          include: {
            games: {
              include: {
                participant1: true,
                participant2: true,
              },
            },
          },
          orderBy: {
            name: 'desc',
          },
        },
      },
    });

    return tournament;
  }

  async updateById({ id, data }: updateDataById<any>) {
    const tournament = await this.instance.update({
      where: {
        id,
      },
      data,
    });
    return tournament;
  }

  async deleteById({ id }: OnlyId) {
    const tournament = await this.instance.delete({
      where: {
        id,
      },

      include: {
        rounds: true,
      },
    });
    return tournament;
  }
}

const tournamentModel = new TournamentModel();

export default tournamentModel;
