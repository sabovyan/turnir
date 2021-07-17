import BadRequestError from '../../errors/BadRequestError';

import roundModel, { IRoundModel } from './round.model';
import gameService, { IGameService } from '../game/game.service';

import { FunctionTypeWithPromiseResult, OnlyId } from '../../types';
import {
  createDraftRounds,
  sortRounds,
  transferParticipants,
} from './round.util';
import {
  ICreateMultipleRoundArgs,
  IDraftRound,
  RoundWithGames,
} from './Round.type';

export interface IRoundService {
  create: FunctionTypeWithPromiseResult<IDraftRound, RoundWithGames>;

  createMany: FunctionTypeWithPromiseResult<
    ICreateMultipleRoundArgs,
    RoundWithGames[]
  >;

  getById: FunctionTypeWithPromiseResult<OnlyId, RoundWithGames>;

  getAllByTournamentId: FunctionTypeWithPromiseResult<OnlyId, RoundWithGames[]>;

  updateFirstRoundGameStatus: FunctionTypeWithPromiseResult<
    RoundWithGames,
    boolean
  >;

  updateGameParticipants: FunctionTypeWithPromiseResult<RoundWithGames[], void>;

  deleteAllByTournamentId: FunctionTypeWithPromiseResult<
    OnlyId[],
    RoundWithGames[]
  >;
}

class RoundService implements IRoundService {
  roundModel: IRoundModel;
  gameService: IGameService;

  constructor() {
    this.roundModel = roundModel;
    this.gameService = gameService;
  }

  async create(InitialRound: IDraftRound) {
    const round = await this.roundModel.create({
      games: InitialRound.games,
      name: InitialRound.name,
    });

    return round;
  }

  async createMany({ games }: ICreateMultipleRoundArgs) {
    const draftRounds = createDraftRounds({ games });

    const createdRounds = draftRounds.map(async (round) => {
      const createdRound = await this.create(round);
      return createdRound;
    });

    return Promise.all(createdRounds);
  }

  async getById(data: OnlyId) {
    const round = await this.roundModel.getById(data);
    if (!round) throw new BadRequestError("round doesn't exist");

    return round;
  }

  async getAllByTournamentId({ id }: OnlyId) {
    const rounds = await this.roundModel.getAllByTournamentId({ id });
    return rounds;
  }

  async deleteAllByTournamentId(data: OnlyId[]) {
    const rounds = data.map(async ({ id }) => {
      const round = await this.roundModel.deleteById({ id });
      return round;
    });

    return Promise.all(rounds);
  }

  async updateGameParticipants(rounds: RoundWithGames[]) {
    const sortedRounds = sortRounds(rounds);

    const [firstRound, ...rest] = sortedRounds;

    const areFirstRoundGamesUpdated = await this.updateFirstRoundGameStatus(
      firstRound,
    );

    if (!areFirstRoundGamesUpdated)
      throw new BadRequestError('first Round games were not updated');

    const nextToFirstRound = rest[0];

    const fullUpdate = nextToFirstRound.games.map(async (game) => {
      const updatedGames = await transferParticipants(game);
      return !!updatedGames;
    });

    const collectedAnswers = await Promise.all(fullUpdate);

    const isFullUpdatedDone = collectedAnswers.every((ans) => ans === true);
    if (!isFullUpdatedDone)
      throw new BadRequestError('first Round games were not updated');
  }

  async updateFirstRoundGameStatus(round: RoundWithGames) {
    const collectedPromise = round.games.map(async (game) => {
      if (!game.participant1Id || !game.participant2Id) {
        const isUpdated = await this.gameService.updateGameCompletionStatus({
          id: game.id,
        });
        return isUpdated;
      }
      return !!game;
    });

    const collected = await Promise.all(collectedPromise);
    const areGamesCompleted = collected.every((ans) => ans === true);
    return areGamesCompleted;
  }
}

const roundService = new RoundService();

export default roundService;
