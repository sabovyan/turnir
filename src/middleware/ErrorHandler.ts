import { ValidationError } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import BaseError from '../errors/BaseError';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let message = 'internal server error';
  let code = 500;

  if (err instanceof BaseError) {
    code = err.code;
    message = err.message;
  }

  const response = {
    error: message,
  };

  res.status(code).json(response);
};
export default errorHandler;
