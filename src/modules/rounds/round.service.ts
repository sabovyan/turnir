import { cloneDeep } from 'lodash';
import { Round, Game } from '@prisma/client';
import roundModel, { IRoundModel } from './round.model';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types/main';

interface InitialRound {
  name: string;
  games: Game[];
}

export interface IRoundService {
  createMany: FunctionTypeWithPromiseResult<
    { games: Game[]; numberOfRounds: number },
    Round[]
  >;

  create: FunctionTypeWithPromiseResult<InitialRound, Round>;

  deleteTournamentAllRounds: FunctionTypeWithPromiseResult<
    OnlyId[],
    (Round & { games: Game[] })[]
  >;
}

class RoundService implements IRoundService {
  model: IRoundModel;

  constructor() {
    this.model = roundModel;
  }

  async create(InitialRound: InitialRound) {
    const round = await this.model.create({
      games: InitialRound.games,
      name: InitialRound.name,
    });

    return round;
  }

  // eslint-disable-next-line class-methods-use-this
  async createMany({
    games,
    numberOfRounds,
  }: {
    games: Game[];
    numberOfRounds: number;
  }) {
    const copy = cloneDeep(games);

    let gamesQuantityPerRound = 1;

    const rounds = Array.from({ length: numberOfRounds })
      .fill({})
      .reduce<InitialRound[]>((acc) => {
        const round = {
          name:
            gamesQuantityPerRound > 1
              ? `1/${gamesQuantityPerRound} Finals`
              : 'Final',
          games: copy.splice(0, gamesQuantityPerRound),
        };

        gamesQuantityPerRound *= 2;
        acc.push(round);

        return acc;
      }, []);

    const createdRounds = rounds.map(async (round) => {
      const createdRound = await this.create(round);
      return createdRound;
    });

    return Promise.all(createdRounds);
  }

  async deleteTournamentAllRounds(data: OnlyId[]) {
    const rounds = data.map(async ({ id }) => {
      const round = await this.model.deleteById({ id });
      return round;
    });

    return Promise.all(rounds);
  }
}

const roundService = new RoundService();

export default roundService;
