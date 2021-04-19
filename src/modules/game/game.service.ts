import {
  FunctionTypeWithPromiseResult,
  GameInstance,
  OnlyId,
} from '../../types';
import {
  GameWithParticipants,
  IAdjustedParticipantPair,
  IUpdateGameScore,
  ParticipantPair,
  Tree,
} from './game.types';
import { generateListFromTree, setupGamesForCreation } from './game.util';
import gameModel, { IGameModel } from './game.model';
import BadRequestError from '../../errors/BadRequestError';
import isNumber from '../../utils/IsNumber';
import getNumberOfRounds from '../../utils/getNumberOfRounds';

interface ICreateTournamentArgs {
  participants: ParticipantPair[];
}

interface IUpdateParticipantArgs {
  gameId: number;
  participantId: number;
  nextGamePosition: number;
}
interface IUpdateSemiFinalArgs {
  games: GameInstance[];
  thirdPlaceGameId: number;
}

export interface IGameService {
  createSingleGame: FunctionTypeWithPromiseResult<OnlyId, GameInstance>;

  createGamesForATournament: FunctionTypeWithPromiseResult<
    ICreateTournamentArgs,
    GameInstance[]
  >;

  updateGameParticipant: FunctionTypeWithPromiseResult<
    IUpdateParticipantArgs,
    GameInstance
  >;

  updateGameCompletionStatus: FunctionTypeWithPromiseResult<OnlyId, boolean>;

  updateSemiFinalGames: FunctionTypeWithPromiseResult<
    IUpdateSemiFinalArgs,
    GameInstance[]
  >;

  updateGameScore: FunctionTypeWithPromiseResult<
    IUpdateGameScore,
    GameInstance
  >;

  deleteMultiple: FunctionTypeWithPromiseResult<
    OnlyId[],
    GameWithParticipants[]
  >;

  getGamesByNextGameId: FunctionTypeWithPromiseResult<OnlyId, GameInstance[]>;

  getById: FunctionTypeWithPromiseResult<OnlyId, GameInstance>;
}

class GameService implements IGameService {
  private gameModel: IGameModel;

  constructor() {
    this.gameModel = gameModel;
  }

  async createSingleGame({ id }: OnlyId) {
    const game = await this.gameModel.create({
      nextGameId: null,
      nextGamePosition: 1,
      participants: {},
      roundId: id,
    });

    return game;
  }

  async updateGameCompletionStatus(data: OnlyId) {
    const game = await this.gameModel.updateCompletionStatus(data);

    return !!game;
  }

  async createGamesForATournament({ participants }: ICreateTournamentArgs) {
    const adjustedGames = setupGamesForCreation({ participants });

    const numberOfRounds = getNumberOfRounds(participants.length);

    const duplicate: IAdjustedParticipantPair[] = JSON.parse(
      JSON.stringify(adjustedGames),
    );

    const createGames = async (
      nextGameId: number | null,
      remainingRounds: number,
      nextGamePosition: number,
    ): Promise<Tree | { game: GameInstance }> => {
      let game;
      if (remainingRounds === 1) {
        game = await this.gameModel.create({
          nextGameId,
          participants: duplicate.splice(0, 1)[0],
          nextGamePosition,
        });
        return { game };
      }

      game = await this.gameModel.create({
        nextGameId,
        participants: {},
        nextGamePosition,
      });

      const first = await createGames(game.id, remainingRounds - 1, 1);
      const second = await createGames(game.id, remainingRounds - 1, 2);
      const root: Tree = {
        game,
        first,
        second,
      };

      return root;
    };

    const node = await createGames(null, numberOfRounds, 1);
    const list = generateListFromTree(node);

    return list;
  }

  async getGamesByNextGameId({ id }: OnlyId) {
    const games = await this.gameModel.findByNextGameId({ id });

    return games;
  }

  async getById(data: OnlyId) {
    const game = await this.gameModel.getById(data);
    if (!game) throw new BadRequestError('game was not found');

    return game;
  }

  async updateGameParticipant({
    gameId,
    participantId,
    nextGamePosition,
  }: IUpdateParticipantArgs) {
    if (nextGamePosition === 1) {
      const game = await this.gameModel.updateFirstParticipant({
        gameId,
        participantId,
      });
      return game;
    }

    const game = await this.gameModel.updateSecondParticipant({
      gameId,
      participantId,
    });
    return game;
  }

  async updateSemiFinalGames({
    games,
    thirdPlaceGameId,
  }: IUpdateSemiFinalArgs) {
    const updatedGames = games.map(async (game) => {
      const updatedGame = await this.gameModel.connectThirdPlaceGame({
        gameId: game.id,
        thirdPlaceGameId,
      });
      return updatedGame;
    });

    return Promise.all(updatedGames);
  }

  deleteMultiple(data: OnlyId[]) {
    const games = data.map(async ({ id }) => {
      const game = await this.gameModel.deleteById({ id });
      return game;
    });

    return Promise.all(games);
  }

  async updateGameScore({
    firstParticipantScore,
    gameId,
    secondParticipantScore,
  }: IUpdateGameScore) {
    if (!isNumber(gameId)) throw new BadRequestError('id is not a number');

    if (!firstParticipantScore.length || !secondParticipantScore.length) {
      throw new BadRequestError('one of the scores is absent');
    }

    if (firstParticipantScore.length !== secondParticipantScore.length) {
      throw new BadRequestError('some data is missing');
    }

    const game = await this.gameModel.updateGameScore({
      firstParticipantScore,
      secondParticipantScore,
      gameId,
    });

    return game;
  }
}

const gameService = new GameService();

export default gameService;
