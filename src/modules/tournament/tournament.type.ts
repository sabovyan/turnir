import { PlayerId } from '../../types/main';

export interface InitialGame {
  participant1?: PlayerId[];
  participant2?: PlayerId[];
}

export interface setupGamesArgs {
  games: InitialGame[];
  hasThirdPlaceGame: boolean;
}

export interface adjustedGame {
  participant1?: {
    connect: PlayerId[];
  };
  participant2?: {
    connect: PlayerId[];
  };
}

export interface ICreateTournamentArgs {
  userId: number;
  winningSets: number;
  goalsToWin: number;
  tournamentTypeId: number;
}

export interface ICreateTournamentRequestBody extends ICreateTournamentArgs {
  games: InitialGame[];
  hasThirdPlaceGame: boolean;
}

export interface ICreateTournamentData extends ICreateTournamentArgs {
  games: adjustedGame[];
  hasThirdPlaceGame: boolean;
}
