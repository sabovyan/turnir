import { Game } from '.prisma/client';
import { OnlyId } from '../../types/main';

export interface ParticipantPair {
  participant1?: {
    name: string;
    players: OnlyId[];
  };
  participant2?: {
    name: string;
    players: OnlyId[];
  };
}

export interface ICreateParticipant {
  create: {
    name: string;
    players: {
      connect: OnlyId[];
    };
  };
}

export interface IAdjustedGame {
  participant1?: ICreateParticipant;
  participant2?: ICreateParticipant;
}

export interface ICreateGameArgs {
  participants: IAdjustedGame;
  nextGameId: number | null;
  index: number;
}

export interface Tree {
  game: Game;
  first?: Tree;
  second?: Tree;
}

export interface IUpdateParticipants {
  gameId: number;
  participant1Id: number | undefined;
  participant2Id: number | undefined;
}

export interface setupGamesArgs {
  participants: ParticipantPair[];
}
