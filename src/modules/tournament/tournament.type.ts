// import { Game, Participant, Round } from '@prisma/client';
import { RoundInstance, TournamentInstance } from '../../types';
import { IUpdateGameScore, ParticipantPair } from '../game/game.types';
import { RoundWithGamesAndParticipants } from '../rounds/Round.type';

export interface ICreateTournamentArgs {
  userId: number;
  winningSets: number;
  goalsToWin: number;
  tournamentTypeId: number;
  name: string;
}

export interface ICreateTournament extends ICreateTournamentArgs {
  games: ParticipantPair[];
  hasThirdPlaceGame: boolean;
}

export interface ICreateTournamentData extends ICreateTournamentArgs {
  hasThirdPlaceGame: boolean;
  rounds: RoundInstance[];
}

export interface TournamentAllTogether extends TournamentInstance {
  rounds: RoundWithGamesAndParticipants[];
}

export interface IUpdateTournamentGame extends IUpdateGameScore {
  tournamentId: number;
}

export type ShrunkTournament = Pick<
  TournamentInstance,
  'id' | 'tournamentTypeId' | 'name' | 'createdAt'
>;

export interface TournamentWithRounds extends TournamentInstance {
  rounds: RoundInstance[];
}
