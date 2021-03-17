import { Request } from 'express';

export interface Args<T> {
  data: T;
}

export interface IRequest<T> extends Request {
  body: T;
}

export type FunctionTypeWidthProps<Props, Result> = (props: Props) => Result;

export type FunctionTypeWithPromiseResult<
  Props = any,
  Result = any
> = FunctionTypeWidthProps<Props, Promise<Result>>;

export type PlayerId = {
  id: number;
};
