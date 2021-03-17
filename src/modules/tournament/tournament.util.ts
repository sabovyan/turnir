import { adjustedGame, InitialGame, setupGamesArgs } from './tournament.type';

type FnSetupGame = (data: setupGamesArgs) => adjustedGame[];

export const setupGamesForATournament: FnSetupGame = ({
  games,
  hasThirdPlaceGame,
}) => {
  const missingGamesQuantity = hasThirdPlaceGame
    ? games.length
    : games.length - 1;

  const missingGames: InitialGame[] = Array(missingGamesQuantity).fill({});

  const totalGames = [...games, ...missingGames];

  const adjustedGames = totalGames.reduce<adjustedGame[]>((acc, el) => {
    const game: adjustedGame = {
      participant1: {
        connect: [],
      },
      participant2: {
        connect: [],
      },
    };

    if (el.participant1) {
      game.participant1!.connect = el.participant1;
    }

    if (el.participant2) {
      game.participant2!.connect = el.participant2;
    }
    acc.push(game);

    return acc;
  }, []);

  return adjustedGames;
};

// const games: Game[] = [
//   {
//     participant1: [{ id: 1 }, { id: 2 }],
//     participant2: [{ id: 3 }, { id: 4 }],
//   },
//   {
//     participant1: [{ id: 5 }, { id: 6 }],
//     participant2: [{ id: 7 }, { id: 8 }],
//   },
// ];

// const args: Args<setupGamesArguments> = {
//   data: {
//     games,
//     hasThirdPlaceGame: false,
//   },
// };

// create tournament

// get data

/* 
  {
    gamesForFirstRound: [],
    ...tournamentSettings
  }

  gameForFirstRound : {
    participant1Ids: [{id: 1}, {id: 2}],
    participant2Ids: [{id: 3}, {id: 4}],
  }

  round: {
    game: 
    name: 

  }

*/

// 1. create tournament

// 2.
