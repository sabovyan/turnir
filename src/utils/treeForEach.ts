import { Game } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { Tree } from '../modules/game/game.types';

export const treeForEach = (
  tree: Tree,
  cb: (game: Game, idx?: number) => void,
): void => {
  const arrayOfNode: Tree[] = [];
  let count = 0;
  arrayOfNode.push(tree);

  while (arrayOfNode.length > 0) {
    const current = arrayOfNode.shift();
    if (current?.game) {
      const { game } = current;
      cb(game, count);
      if (current.first) {
        arrayOfNode.push(current.first);
      }

      if (current.second) {
        arrayOfNode.push(current.second);
      }
      count += 1;
    }
  }
};

export const treeMap = (
  tree: Tree,
  cb: (game: Game, idx?: number) => Game,
): Game[] => {
  const localTree = cloneDeep(tree);
  const arrayOfNode: Tree[] = [];
  let count = 0;

  arrayOfNode.push(localTree);

  const res: Game[] = [];

  while (arrayOfNode.length > 0) {
    const current = arrayOfNode.shift();
    if (current?.game) {
      const { game } = current;
      const result = cb(game, count);
      res.push(result);
      if (current.first) {
        arrayOfNode.push(current.first);
      }

      if (current.second) {
        arrayOfNode.push(current.second);
      }
      count += 1;
    }
  }

  return res;
};
