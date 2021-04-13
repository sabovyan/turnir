import { Game, Round } from '@prisma/client';
import { IAdjustedGame, ParticipantPair } from '../game/games.types';

export interface ICreateTournamentArgs {
  userId: number;
  winningSets: number;
  goalsToWin: number;
  tournamentTypeId: number;
  name: string;
}

export interface ICreateTournamentRequestBody extends ICreateTournamentArgs {
  games: ParticipantPair[];
  hasThirdPlaceGame: boolean;
}

export interface ICreateTournamentData extends ICreateTournamentArgs {
  hasThirdPlaceGame: boolean;
  rounds: Round[];
}
