import { NextFunction, Request, Response } from 'express';
import { accessToken } from '../config/token';
import AuthError from '../errors/AuthError';

const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AuthError('unauthorized request');
  }

  const bearer = authorization.split(' ');
  const aToken = bearer[1];

  console.log(aToken);

  const accessPayload = accessToken.decodeAndVerify(aToken);

  if (accessPayload.err) {
    throw new AuthError(accessPayload.err.message);
  } else {
    next();
  }
};
export default authenticateUser;
