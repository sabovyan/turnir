import { Game } from '.prisma/client';

const connectedGames: Game[] = [
  {
    id: 30,
    participant1Id: 46,
    participant2Id: 45,
    index: null,
    thirdPlaceGameId: null,
    nextGameId: null,
    score: [],
    roundId: null,
  },
  {
    id: 31,
    participant1Id: 47,
    participant2Id: null,
    index: null,
    thirdPlaceGameId: null,
    nextGameId: null,
    score: [],
    roundId: null,
  },
  {
    id: 32,
    participant1Id: null,
    participant2Id: null,
    index: null,
    thirdPlaceGameId: null,
    nextGameId: null,
    score: [],
    roundId: null,
  },
];

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
