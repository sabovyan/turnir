import { Prisma } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import {
  FunctionTypeWithPromiseResult,
  OnlyId,
  TournamentInstance,
  updateDataById,
} from '../../types';
import {
  ICreateTournamentData,
  ShrunkTournament,
  TournamentAllTogether,
  TournamentWithRounds,
} from './tournament.type';

export interface ITournamentModel {
  create: FunctionTypeWithPromiseResult<
    ICreateTournamentData,
    TournamentAllTogether
  >;
  getAll: FunctionTypeWithPromiseResult<OnlyId, ShrunkTournament[]>;
  getById: FunctionTypeWithPromiseResult<OnlyId, TournamentAllTogether | null>;
  updateById: FunctionTypeWithPromiseResult<
    updateDataById<any>,
    TournamentInstance
  >;

  deleteById: FunctionTypeWithPromiseResult<OnlyId, TournamentWithRounds>;
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
