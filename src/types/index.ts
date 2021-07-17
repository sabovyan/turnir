import { Game, Participant, Round, Tournament } from '@prisma/client';
import { Request } from 'express';

export type GameInstance = Game;
export type RoundInstance = Round;
export type TournamentInstance = Tournament;
export type ParticipantInstance = Participant;

export interface IRequest<T> extends Request {
  body: T;
}

export type FunctionTypeWidthProps<Props, Result> = (props: Props) => Result;

export type FunctionTypeWithPromiseResult<
  Props = unknown,
  Result = unknown
> = FunctionTypeWidthProps<Props, Promise<Result>>;

export type ObjectWithOneField<K extends string, T> = {
  [P in K]: T;
};

export type OnlyId = ObjectWithOneField<'id', number>;
export type OnlyName = ObjectWithOneField<'name', string>;

export type updateDataById<T> = {
  id: number;
  data: T;
};

export interface RequestWithUser extends Request {
  user?: {
    id: number;
  };
}

export enum RoundName {
  final = 'Final',
  semiFinal = '1/2 Finals',
}