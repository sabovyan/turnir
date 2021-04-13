import { Game } from '@prisma/client';

import { IAdjustedGame, setupGamesArgs, Tree } from './games.types';

export const generateListFromTree = (tree: Tree): Game[] => {
  const arrayOfNode: Tree[] | undefined = [];
  const result: Game[] = [];

  arrayOfNode.push(tree);
  while (arrayOfNode.length > 0) {
    const current = arrayOfNode.shift();
    if (current) {
      result.push(current.game);
      if (current.first) {
        arrayOfNode.push(current.first);
      }

      if (current.second) {
        arrayOfNode.push(current.second);
      }
    }
  }
  return result;
};

type FnSetupGame = (data: setupGamesArgs) => IAdjustedGame[];

export const setupGamesForCreation: FnSetupGame = ({ participants }) => {
  const adjustedGames = participants.reduce<IAdjustedGame[]>((acc, el) => {
    const game: IAdjustedGame = {};

    if (el.participant1) {
      game.participant1 = {
        create: {
          name: '',
          players: {
            connect: [],
          },
        },
      };

      game.participant1.create.name = el.participant1.name;
      game.participant1.create.players.connect = el.participant1.players;
    }

    if (el.participant2) {
      game.participant2 = {
        create: {
          name: '',
          players: {
            connect: [],
          },
        },
      };

      game.participant2.create.name = el.participant2.name;

      game.participant2.create.players.connect = el.participant2.players;
    }

    acc.push(game);

    return acc;
  }, []);

  return adjustedGames;
};
