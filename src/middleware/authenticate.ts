import { NextFunction, Request, Response } from 'express';
import { accessToken } from '../config/token';
import AuthError from '../errors/AuthError';

interface requestWithUser extends Request {
  user?: {
    id: number;
  };
}

const authenticateUser = (
  req: requestWithUser,
  res: Response,
  next: NextFunction,
): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AuthError('unauthorized request');
  }

  const bearer = authorization.split(' ');
  const aToken = bearer[1];

  const accessPayload = accessToken.decodeAndVerify(aToken);

  if (accessPayload.err) {
    throw new AuthError(accessPayload.err.message);
  } else {
    req.user = {
      id: accessPayload.id,
    };
    next();
  }
};
export default authenticateUser;
