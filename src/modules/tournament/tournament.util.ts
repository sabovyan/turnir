import { Game } from '.prisma/client';

export const setupGamesForUpdate = (
  games: Game[],
  _firstRoundGamesQuantity: number,
  hasThirdPlaceGame: boolean,
): Game[] => {
  const copiedGames: Game[] = JSON.parse(JSON.stringify(games));
  copiedGames.reverse();

  let count = 0;
  let linkedGamesCount = 0;

  const updatedGames = copiedGames.reduce<Game[]>((acc, game, idx) => {
    if (idx === 0) {
      acc.push(game);
      return acc;
    }

    if (idx < 2 && hasThirdPlaceGame) {
      acc.push(game);
      return acc;
    }

    if (idx > 1 && idx < 4) {
      if (hasThirdPlaceGame) {
        game.thirdPlaceGameId = games[1].id;
      }
      game.nextGameId = copiedGames[count].id;

      acc.push(game);
      return acc;
    }

    game.nextGameId = copiedGames[count].id;

    linkedGamesCount += 1;

    if (linkedGamesCount === 2) {
      linkedGamesCount = 1;
      count += 1;
    }

    acc.push(game);
    return acc;
  }, []);

  return updatedGames;
};

type IScore = {
  firstScore: number;
  secondScore: number;
};

export const countVictories = (
  firstScore: number[],
  secondScore: number[],
): IScore => {
  const victories = firstScore.reduce<IScore>(
    (acc, el, idx) => {
      if (el > secondScore[idx]) {
        acc.firstScore += 1;
        return acc;
      }

      if (el < secondScore[idx]) {
        acc.secondScore += 1;
        return acc;
      }

      return acc;
    },
    { firstScore: 0, secondScore: 0 },
  );

  return victories;
};

export const getWinnerAndLooserIds = (
  game: Game,
): { winnerId: number | null; looserId: number | null } => {
  const victoryQuantity = countVictories(
    game.firstParticipantScore,
    game.secondParticipantScore,
  );

  let winnerId: number | null;
  let looserId: number | null;

  if (victoryQuantity.firstScore > victoryQuantity.secondScore) {
    winnerId = game.participant1Id;
    looserId = game.participant2Id;
  } else {
    winnerId = game.participant2Id;
    looserId = game.participant1Id;
  }

  return { winnerId, looserId };
};
