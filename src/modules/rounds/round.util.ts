import { cloneDeep } from 'lodash';
import BadRequestError from '../../errors/BadRequestError';
import { GameInstance, RoundInstance, RoundName } from '../../types';
import getNumberOfRounds from '../../utils/getNumberOfRounds';
import gameService from '../game/game.service';
import {
  IDraftRound,
  RoundWithGames,
  RoundWithGamesAndParticipants,
} from './Round.type';

export const getNumberFromName = (name: string): number => {
  const n = name.split(' ')[0].split('/')[1];
  return Number(n);
};

export const createDraftRounds = ({
  games,
}: {
  games: GameInstance[];
}): IDraftRound[] => {
  const copy = cloneDeep(games);
  const numberOfRounds = getNumberOfRounds(games.length);

  let gamesQuantityPerRound = 1;
  return Array.from({ length: numberOfRounds })
    .fill({})
    .reduce<IDraftRound[]>((acc) => {
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
};

export const getParticipant = (game: GameInstance): number | undefined => {
  let participant: number | undefined;

  if (game.participant1Id) {
    participant = game.participant1Id;
  }

  if (game.participant2Id) {
    participant = game.participant2Id;
  }

  return participant;
};

export const transferParticipants = async (
  game: GameInstance,
): Promise<GameInstance> => {
  if (!game.nextGameId) {
    return game;
  }

  const pair = await gameService.getGamesByNextGameId({
    id: game.id,
  });
  const pairFirstGame = pair[0];
  const pairSecondGame = pair[1];

  if (pairFirstGame.isCompleted) {
    if (pairFirstGame.participant1Id && pairFirstGame.participant2Id)
      return game;

    const pairFirstParticipant = getParticipant(pairFirstGame);

    if (pairFirstParticipant) {
      await gameService.updateGameParticipant({
        gameId: game.id,
        participantId: pairFirstParticipant,
        nextGamePosition: pairFirstGame.nextGamePosition,
      });
    } else {
      await gameService.updateGameCompletionStatus({ id: game.id });
    }
  }

  if (pairSecondGame.isCompleted) {
    if (pairSecondGame.participant1Id && pairSecondGame.participant2Id)
      return game;

    const pairSecondParticipant = getParticipant(pairSecondGame);

    if (pairSecondParticipant) {
      await gameService.updateGameParticipant({
        gameId: game.id,
        participantId: pairSecondParticipant,
        nextGamePosition: pairSecondGame.nextGamePosition,
      });
    } else {
      await gameService.updateGameCompletionStatus({ id: game.id });
    }
  }

  const nextGame = await gameService.getById({ id: game.nextGameId });

  // eslint-disable-next-line no-return-await
  return await transferParticipants(nextGame);
};

type FnWithSamePropsAndResult<T> = (props: T) => T;

export const sortRounds: FnWithSamePropsAndResult<RoundWithGames[]> = (
  rounds,
) => {
  const copy = cloneDeep(rounds);

  const final = copy.find((round) => round.name === RoundName.final);
  const restRounds = copy.filter((el) => el.name !== RoundName.final);
  if (!final) throw new BadRequestError("final Round doesn't exist");

  const sortedRounds = restRounds.sort(
    (a, b) => getNumberFromName(b.name) - getNumberFromName(a.name),
  );

  return [...sortedRounds, final];
};
