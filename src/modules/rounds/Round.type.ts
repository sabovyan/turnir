import { GameInstance, RoundInstance } from '../../types';
import { GameWithParticipants } from '../game/game.types';

export interface IDraftRound {
  name: string;
  games: GameInstance[];
}

export interface RoundWithGames extends RoundInstance {
  games: GameInstance[];
}

export interface RoundWithGamesAndParticipants extends RoundInstance {
  games: GameWithParticipants[];
}

export interface ICreateMultipleRoundArgs {
  games: GameInstance[];
}
