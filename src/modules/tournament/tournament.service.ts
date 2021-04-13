import { Game, Participant, Tournament } from '.prisma/client';
import BadRequestError from '../../errors/BadRequestError';
import {
  FunctionTypeWithPromiseResult,
  OnlyId,
  OnlyName,
  updateDataById,
} from '../../types/main';
import gameService, { IGameService } from '../game/games.service';
import participantService, {
  IParticipantService,
} from '../participant/participant.service';
import roundService, { IRoundService } from '../rounds/round.service';
import tournamentModel, { ITournamentModel } from './tournament.model';
import { ICreateTournamentRequestBody } from './tournament.type';

interface GameWithParticipants extends Game {
  participant1: Participant[];
  participant2: Participant[];
}

interface TournamentAllTogether extends Tournament {
  games: GameWithParticipants[];
}

interface ITournamentService {
  create: FunctionTypeWithPromiseResult<
    ICreateTournamentRequestBody,
    TournamentAllTogether
  >;

  getAll: FunctionTypeWithPromiseResult<OnlyId, TournamentAllTogether[]>;
  getById: FunctionTypeWithPromiseResult<OnlyId, Tournament>;
  updateNameById: FunctionTypeWithPromiseResult<
    updateDataById<OnlyName>,
    Tournament
  >;

  deleteById: FunctionTypeWithPromiseResult<OnlyId, Tournament>;
}

// class TournamentService implements ITournamentService {
class TournamentService {
  private tournamentModel: ITournamentModel;
  private gameService: IGameService;
  private roundService: IRoundService;
  private participantService: IParticipantService;

  constructor() {
    this.tournamentModel = tournamentModel;
    this.gameService = gameService;
    this.roundService = roundService;
    this.participantService = participantService;
  }

  async create(data: ICreateTournamentRequestBody) {
    const { games, hasThirdPlaceGame, ...rest } = data;

    /* validate data
      if games.length % 2 !== 0 return not valid number of games

      if games.length < 1 throw new BadRequestError('you don't need us')
    
      if tournamentTypeID is <= 3 && >=1 

      if user doesn't exist
    
    */

    const numberOfRounds = Math.log(games.length) / Math.log(2) + 1;

    const createdGames = await this.gameService.createGamesForATournament({
      participants: games,
      numberOfRounds,
    });

    const rounds = await this.roundService.createMany({
      games: createdGames,
      numberOfRounds,
    });

    if (hasThirdPlaceGame) {
      const finalRoundId = rounds.findIndex((round) => round.name === 'Final');

      const thirdPlaceGame = await this.gameService.createSingleGame({
        id: finalRoundId,
      });
    }

    const tournament = await this.tournamentModel.create({
      ...rest,
      rounds,
      hasThirdPlaceGame,
    });

    return tournament;
  }

  async getAll(data: OnlyId) {
    if (!data.id) throw new BadRequestError('id is not defined');

    const allTournament = await this.tournamentModel.getAll(data);

    return allTournament;
  }

  async getById({ id }: OnlyId) {
    const tournament = await this.tournamentModel.getById({ id });

    if (!tournament) throw new BadRequestError('Tournament was not found');

    return tournament;
  }

  async updateNameById(data: updateDataById<OnlyName>) {
    /* validate data */

    const tournament = await this.tournamentModel.updateById(data);
    return tournament;
  }

  async deleteById(data: OnlyId) {
    const tournament = await this.tournamentModel.deleteById(data);

    const roundIds = tournament.rounds.map((r) => ({ id: r.id }));

    const deletedRounds = await this.roundService.deleteTournamentAllRounds(
      roundIds,
    );

    const games = deletedRounds.reduce<Game[]>(
      (acc, el) => [...acc, ...el.games],
      [],
    );

    const gameIds = games.map((g) => ({ id: g.id }));

    const deletedGames = await this.gameService.deleteTournamentAllGames(
      gameIds,
    );

    const ParticipantSet = deletedGames.reduce<Set<number>>(
      (acc, { participant1Id, participant2Id }) => {
        if (participant1Id) {
          acc.add(participant1Id);
        }

        if (participant2Id) {
          acc.add(participant2Id);
        }

        return acc;
      },
      new Set(),
    );

    const participants = Array.from(ParticipantSet).map((el) => ({ id: el }));

    const deletedParticipants = await this.participantService.deleteMany(
      participants,
    );

    return tournament;
  }
}
const tournamentService = new TournamentService();

export default tournamentService;
