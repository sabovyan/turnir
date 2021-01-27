/* eslint-disable class-methods-use-this */
import { Tournament } from '@prisma/client';
import prisma from '../../lib/prismaClient';
import tournamentRouter from './tournament.route';

interface ITournament {
  getTournaments: (userId: number) => Promise<Tournament[]>;
  getTournament: (tournamentId: number) => Promise<Tournament | null>;
  createTournament: (
    data: Tournament,
    tournamentTypeId: number,
  ) => Promise<Tournament>;
  // updateTournament: () => Promise<Tournament>;
  // deleteTournament: () => Promise<Tournament>;
  // deleteAllTournament: () => Promise<Tournament[]>;
}

class TournamentModel implements ITournament {
  // eslint-disable-next-line class-methods-use-this
  async getTournaments(userId: number): Promise<Tournament[]> {
    const tournaments = await prisma.tournament.findMany({
      where: {
        userId,
      },
    });
    return tournaments;
  }

  // eslint-disable-next-line class-methods-use-this
  async getTournament(tournamentId: number): Promise<Tournament | null> {
    const tournament = prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
    });
    return tournament;
  }

  async createTournament(
    data: Tournament,
    tournamentTypeId: number,
  ): Promise<Tournament> {
    const tournament = await prisma.tournament.create({
      data: {
        ...data,
        User: {
          connect: {
            id: data.userId,
          },
        },
        tournamentType: {
          connect: {
            id: tournamentTypeId,
          },
        },
      },
    });

    return tournament;
  }
  // updateTournament: () => Promise<Tournament>;
  // deleteTournament: () => Promise<Tournament>;
}

export default TournamentModel;
