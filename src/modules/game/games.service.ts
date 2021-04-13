import { Game } from '.prisma/client';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types/main';
import { IAdjustedGame, ParticipantPair, Tree } from './games.types';
import { generateListFromTree, setupGamesForCreation } from './game.util';
import gameModel, { IGameModel } from './games.model';
import { Participant } from '@prisma/client';

interface ICreateTournamentArgs {
  participants: ParticipantPair[];
  numberOfRounds: number;
}

export interface IGameService {
  createSingleGame: FunctionTypeWithPromiseResult<OnlyId, any>;

  createGamesForATournament: FunctionTypeWithPromiseResult<
    ICreateTournamentArgs,
    Game[]
  >;
  initialUpdateOfGameParticipants: (games: Game[]) => void;

  deleteTournamentAllGames: FunctionTypeWithPromiseResult<
    OnlyId[],
    (Game & {
      participant1: Participant | null;
      participant2: Participant | null;
    })[]
  >;
}

class GameService implements IGameService {
  private model: IGameModel;

  constructor() {
    this.model = gameModel;
  }

  async createSingleGame({ id }: OnlyId) {
    const game = await this.model.create({
      nextGameId: null,
      nextGamePosition: 1,
      participants: {},
      roundId: id,
    });

    return game;
  }

  async createGamesForATournament({
    participants,
    numberOfRounds,
  }: ICreateTournamentArgs) {
    const adjustedGames = setupGamesForCreation({ participants });

    const duplicate: IAdjustedGame[] = JSON.parse(
      JSON.stringify(adjustedGames),
    );

    const createGames = async (
      nextGameId: number | null,
      remainingRounds: number,
      nextGamePosition: number,
    ): Promise<Tree | { game: Game }> => {
      let game;
      if (remainingRounds === 1) {
        game = await this.model.create({
          nextGameId,
          participants: duplicate.splice(0, 1)[0],
          nextGamePosition,
        });
        return { game };
      }

      game = await this.model.create({
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

    await this.initialUpdateOfGameParticipants(list);

    return list;
  }

  async initialUpdateOfGameParticipants(games: Game[]) {
    const isUpdated = games.map(async (g) => {
      if (!g.nextGameId) return !!g;

      const args: {
        gameId: number;
        participant1Id: number | undefined;
        participant2Id: number | undefined;
      } = {
        gameId: g.nextGameId,
        participant1Id: undefined,
        participant2Id: undefined,
      };

      if (!g.participant1Id && !g.participant1Id) return !!g;

      if (!g.participant1Id && g.participant2Id) {
        args.participant1Id =
          g.nextGamePosition === 1 ? g.participant2Id : undefined;
        args.participant2Id =
          g.nextGamePosition === 2 ? g.participant2Id : undefined;
      }

      if (g.participant1Id && !g.participant2Id) {
        args.participant1Id =
          g.nextGamePosition === 1 ? g.participant1Id : undefined;
        args.participant2Id =
          g.nextGamePosition === 2 ? g.participant1Id : undefined;
      }

      const updatedGame = await this.model.updateGameParticipants(args);

      return updatedGame;
    });

    const answers = await Promise.all(isUpdated);

    const final = answers.some((el) => !!el);

    return final;
  }

  deleteTournamentAllGames(data: OnlyId[]) {
    const games = data.map(async ({ id }) => {
      const game = await this.model.deleteById({ id });
      return game;
    });

    return Promise.all(games);
  }
}

const gameService = new GameService();

export default gameService;
