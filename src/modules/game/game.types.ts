import { Participant } from '@prisma/client';
import { GameInstance, OnlyId } from '../../types';

interface IInitialParticipant {
  name: string;
  players: OnlyId[];
}

export interface ParticipantPair {
  participant1?: IInitialParticipant;
  participant2?: IInitialParticipant;
}

export interface ICreateParticipant {
  create: {
    name: string;
    players: {
      connect: OnlyId[];
    };
  };
}

export interface IAdjustedParticipantPair {
  participant1?: ICreateParticipant;
  participant2?: ICreateParticipant;
}

export interface ICreateGameArgs {
  participants: IAdjustedParticipantPair;
  nextGameId: number | null;
  index: number;
}

export interface Tree {
  game: GameInstance;
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

export interface IUpdateGameScore {
  firstParticipantScore: number[];
  secondParticipantScore: number[];
  gameId: number;
}

export interface GameWithParticipants extends GameInstance {
  participant1: Participant | null;
  participant2: Participant | null;
}
