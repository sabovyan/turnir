import { RoundWithGames } from '../modules/rounds/Round.type';
import { GameInstance } from '../types';

const getAllGamesFromRounds = (rounds: RoundWithGames[]): GameInstance[] =>
  rounds.reduce<GameInstance[]>((acc, el) => [...acc, ...el.games], []);

export default getAllGamesFromRounds;
