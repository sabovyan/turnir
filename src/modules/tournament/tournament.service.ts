// import { Game, Tournament } from '.prisma/client';
import BadRequestError from '../../errors/BadRequestError';
import {
  FunctionTypeWithPromiseResult,
  GameInstance,
  OnlyId,
  OnlyName,
  RoundName,
  TournamentInstance,
  updateDataById,
} from '../../types';
import getAllGamesFromRounds from '../../utils/getAllGamesFromRounds';
import getParticipantIdsFromGames from '../../utils/getParticipantsfromGames';
import gameService, { IGameService } from '../game/game.service';
import participantService, {
  IParticipantService,
} from '../participant/participant.service';
import roundService, { IRoundService } from '../rounds/round.service';
import tournamentModel, { ITournamentModel } from './tournament.model';
import {
  ICreateTournament,
  IUpdateTournamentGame,
  ShrunkTournament,
  TournamentAllTogether,
} from './tournament.type';
import { getWinnerAndLooserIds } from './tournament.util';

interface UpdatedGameAndNextGAme {
  updatedGame: GameInstance;
  nextGame?: GameInstance;
}

interface ITournamentService {
  create: FunctionTypeWithPromiseResult<
    ICreateTournament,
    TournamentAllTogether
  >;

  getAll: FunctionTypeWithPromiseResult<OnlyId, ShrunkTournament[]>;
  getById: FunctionTypeWithPromiseResult<OnlyId, TournamentAllTogether | null>;
  updateNameById: FunctionTypeWithPromiseResult<
    updateDataById<OnlyName>,
    TournamentInstance
  >;

  deleteById: FunctionTypeWithPromiseResult<OnlyId, TournamentInstance>;

  updateGameScoreAndNextGameParticipant: FunctionTypeWithPromiseResult<
    IUpdateTournamentGame,
    UpdatedGameAndNextGAme
  >;

  updateCompletionStatus: FunctionTypeWithPromiseResult<
    updateDataById<{ completionStatus: boolean }>,
    TournamentInstance
  >;
}

class TournamentService implements ITournamentService {
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

  async create(data: ICreateTournament) {
    const { games, hasThirdPlaceGame, ...rest } = data;

    /* validate data
      if games.length % 2 !== 0 return not valid number of games

      if games.length < 1 throw new BadRequestError('you don't need us')
    
      if tournamentTypeID is <= 3 && >=1 

      if user doesn't exist
    
    */

    const createdGames = await this.gameService.createGamesForATournament({
      participants: games,
    });

    const rounds = await this.roundService.createMany({
      games: createdGames,
    });

    await this.roundService.updateGameParticipants(rounds);

    if (hasThirdPlaceGame) {
      const finalRound = rounds.find((round) => round.name === RoundName.final);
      if (!finalRound) throw new BadRequestError('Final round was not found');

      const thirdPlaceGame = await this.gameService.createSingleGame({
        id: finalRound.id,
      });

      const semiFinal = rounds.find(
        (round) => round.name === RoundName.semiFinal,
      );

      if (!semiFinal)
        throw new BadRequestError('semiFinal games were not found');

      const updatedSemifinalGames = await this.gameService.updateSemiFinalGames(
        { games: semiFinal.games, thirdPlaceGameId: thirdPlaceGame.id },
      );

      if (!updatedSemifinalGames)
        throw new BadRequestError('bad things happen');
    }

    const tournament = await this.tournamentModel.create({
      ...rest,
      hasThirdPlaceGame,
      rounds,
    });

    if (!tournament)
      throw new BadRequestError(
        'something went wrong with tournament creation',
      );

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

    const { rounds, ...rest } = tournament;

    const newRounds = rounds.map((round) => {
      round.games.sort((a, b) => a.id - b.id);
      return round;
    });

    return { ...rest, rounds: newRounds };
  }

  async updateNameById(data: updateDataById<OnlyName>) {
    /* validate data */

    const tournament = await this.tournamentModel.updateById(data);
    return tournament;
  }

  async deleteById(data: OnlyId) {
    const tournament = await this.tournamentModel.deleteById(data);

    const roundIds = tournament.rounds.map((r) => ({ id: r.id }));
    const deletedRounds = await this.roundService.deleteAllByTournamentId(
      roundIds,
    );

    const games = getAllGamesFromRounds(deletedRounds);
    const gameIds = games.map((g) => ({ id: g.id }));
    const deletedGames = await this.gameService.deleteMultiple(gameIds);

    const participants = getParticipantIdsFromGames(deletedGames);
    const deletedParticipants = await this.participantService.deleteMany(
      participants,
    );

    if (!deletedParticipants.length) {
      throw new BadRequestError('participants were not deleted');
    }

    return tournament;
  }

  async updateGameScoreAndNextGameParticipant({
    firstParticipantScore,
    gameId,
    secondParticipantScore,
    tournamentId,
  }: IUpdateTournamentGame) {
    const updatedGame = await this.gameService.updateGameScore({
      firstParticipantScore,
      gameId,
      secondParticipantScore,
    });

    const { winnerId, looserId } = getWinnerAndLooserIds(updatedGame);
    if (!winnerId) throw new BadRequestError("participant doesn't exist");

    if (updatedGame.nextGameId) {
      const updatedNextGame = await this.gameService.updateGameParticipant({
        gameId: updatedGame.nextGameId,
        nextGamePosition: updatedGame.nextGamePosition,
        participantId: winnerId,
      });

      if (updatedGame.thirdPlaceGameId && looserId) {
        await this.gameService.updateGameParticipant({
          gameId: updatedGame.thirdPlaceGameId,
          nextGamePosition: updatedGame.nextGamePosition,
          participantId: looserId,
        });
      }

      /* ANCHOR this part was responsible for updating all games but it must be removed when initial update is fixed  */

      /* start */

      // const rounds = await this.roundService.getAllByTournamentId({
      //   id: tournamentId,
      // });
      // // const isUpdated =
      // await this.roundService.updateGameParticipants(rounds);
      // if (!isUpdated) throw new BadRequestError('next Games were not updated');

      /* end */

      return { updatedGame, nextGame: updatedNextGame };
    }

    if (!updatedGame.roundId)
      throw new BadRequestError("game doesn't belong to any round");

    const currentRound = await this.roundService.getById({
      id: updatedGame.roundId,
    });

    if (currentRound.name === RoundName.final) {
      const { games } = currentRound;

      if (games.length === 1) {
        await this.updateCompletionStatus({
          id: tournamentId,
          data: { completionStatus: true },
        });
      } else {
        if (!games[1].participant1Id || !games[1].participant2Id) {
          await this.updateCompletionStatus({
            id: tournamentId,
            data: { completionStatus: true },
          });

          return { updatedGame };
        }

        const areGamesCompleted = games.every(
          (game) =>
            game.firstParticipantScore.length &&
            game.secondParticipantScore.length,
        );

        if (areGamesCompleted) {
          await this.updateCompletionStatus({
            id: tournamentId,
            data: { completionStatus: true },
          });
        }
      }
    }

    return { updatedGame };
  }

  async updateCompletionStatus(
    data: updateDataById<{ completionStatus: boolean }>,
  ) {
    const tournament = await this.tournamentModel.updateById(data);

    return tournament;
  }
}
const tournamentService = new TournamentService();

export default tournamentService;
