/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { Game, Player, Prisma, Tournament } from '@prisma/client';
import prisma from '../../lib/prismaClient';

interface ITournament {
  getAll: (userId: number) => Promise<Tournament[]>;
  get: (tournamentId: number) => Promise<Tournament | null>;
  getTournamentWithPlayersAndGames: (
    tournamentId: number,
  ) => Promise<
    Prisma.Prisma__TournamentClient<(Tournament & { players: Player[] }) | null>
  >;
  createTournamentWithPlayers: (
    data: Omit<Tournament, 'id'>,
    players: Omit<Player, 'id'>[],
  ) => Promise<Tournament>;
  // updateTournament: () => Promise<Tournament>;
  // deleteTournament: () => Promise<Tournament>;
  // deleteAllTournament: () => Promise<Tournament[]>;
}

class TournamentModel implements ITournament {
  // eslint-disable-next-line class-methods-use-this
  async getAll(userId: number): Promise<Tournament[]> {
    const tournaments = await prisma.tournament.findMany({
      where: {
        userId,
      },
    });
    return tournaments;
  }

  // eslint-disable-next-line class-methods-use-this
  async get(tournamentId: number): Promise<Tournament | null> {
    const tournament = prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
    });
    return tournament;
  }

  async createTournamentWithPlayers(
    data: Omit<Tournament, 'id'>,
    players: Omit<Player, 'id'>[],
  ): Promise<Tournament> {
    const tournament = await prisma.tournament.create({
      data: {
        winningSets: data.winningSets,
        goalsToWin: data.goalsToWin,
        User: {
          connect: {
            id: data.userId,
          },
        },
        tournamentType: {
          connect: {
            id: data.tournamentTypeId,
          },
        },
        // players: {
        //   create: players.map((pl) => ({ name: pl.name })),
        // },
      },
    });

    return tournament;
  }

  async getTournamentWithPlayersAndGames(
    tournamentId: number,
    // eslint-disable-next-line camelcase
  ): Promise<
    Prisma.Prisma__TournamentClient<
      (Tournament & { players: Player[] } & { games: Game[] }) | null
    >
  > {
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        players: {
          include: {
            score: true,
          },
        },
        games: true,
      },
    });

    return tournament;
  }
  // updateTournament: () => Promise<Tournament>;
  // deleteTournament: () => Promise<Tournament>;
}

const tournamentModel = new TournamentModel();

export default tournamentModel;
