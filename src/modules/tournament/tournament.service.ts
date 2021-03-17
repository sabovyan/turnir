import { Game, Player, Tournament } from '.prisma/client';
import { FunctionTypeWithPromiseResult } from '../../types/main';
import tournamentModel, { ITournamentModel } from './tournament.model';
import { ICreateTournamentRequestBody } from './tournament.type';
import { setupGamesForATournament } from './tournament.util';

interface ITournamentService {
  create: FunctionTypeWithPromiseResult<
    ICreateTournamentRequestBody,
    Tournament & {
      games: (Game & {
        participant1: Player[];
        participant2: Player[];
      })[];
    }
  >;
}

class TournamentService implements ITournamentService {
  private tournamentModel: ITournamentModel;

  constructor() {
    this.tournamentModel = tournamentModel;
  }

  async create(data: ICreateTournamentRequestBody) {
    const { games, hasThirdPlaceGame, ...args } = data;
    /* validate data
      if games.length < 1 throw new BadRequestError('you don't need us')
    
    
    */

    const totalGames = setupGamesForATournament({ games, hasThirdPlaceGame });

    const tournament = await this.tournamentModel.create({
      ...args,
      games: totalGames,
      hasThirdPlaceGame,
    });

    return tournament;
  }
}

const tournamentService = new TournamentService();

export default tournamentService;
