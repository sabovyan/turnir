import { Game, Player, Prisma, Tournament } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import { FunctionTypeWithPromiseResult } from '../../types/main';
import { ICreateTournamentData } from './tournament.type';

interface ICreateGames {
  tournamentId: number;
}

export interface ITournamentModel {
  create: FunctionTypeWithPromiseResult<
    ICreateTournamentData,
    Tournament & {
      games: (Game & {
        participant1: Player[];
        participant2: Player[];
      })[];
    }
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
    games,
  }: ICreateTournamentData) {
    const tournament = await this.instance.create({
      data: {
        winningSets,
        goalsToWin,
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
        games: {
          create: games,
        },
      },
      include: {
        games: {
          include: {
            participant1: true,
            participant2: true,
          },
        },
      },
    });

    return tournament;
  }
}

const tournamentModel = new TournamentModel();

export default tournamentModel;

// eslint-disable-next-line class-methods-use-this
// async getAll(userId: number): Promise<Tournament[]> {
//   const tournaments = await prisma.tournament.findMany({
//     where: {
//       userId,
//     },
//   });
//   return tournaments;
// }

// // eslint-disable-next-line class-methods-use-this
// async get(tournamentId: number): Promise<Tournament | null> {
//   const tournament = prisma.tournament.findUnique({
//     where: {
//       id: tournamentId,
//     },
//   });
//   return tournament;
// }

// async getTournamentWithPlayersAndGames(
//   tournamentId: number,
//   // eslint-disable-next-line camelcase
// ): Promise<
//   Prisma.Prisma__TournamentClient<
//     (Tournament & { players: Player[] } & { games: Game[] }) | null
//   >
// > {
//   const tournament = await prisma.tournament.findUnique({
//     where: {
//       id: tournamentId,
//     },
//     include: {
//       players: {
//         include: {
//           score: true,
//         },
//       },
//       games: true,
//     },
//   });

//   return tournament;
// }
// updateTournament: () => Promise<Tournament>;
// deleteTournament: () => Promise<Tournament>;

// getAll: (userId: number) => Promise<Tournament[]>;
// get: (tournamentId: number) => Promise<Tournament | null>;
// getTournamentWithPlayersAndGames: (
//   tournamentId: number,
// ) => Promise<
//   Prisma.Prisma__TournamentClient<(Tournament & { players: Player[] }) | null>
// >;
// updateTournament: () => Promise<Tournament>;
// deleteTournament: () => Promise<Tournament>;
// deleteAllTournament: () => Promise<Tournament[]>;
