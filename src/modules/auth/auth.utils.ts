import bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../../config/envConstants';
import ValidationError from '../../errors/ValidationError';
import registerValidationSchema from './registerValidate.schema';
import { LoginResponse, ResponseUser, Tokens, UserData } from './auth.types';
import { accessToken, refreshToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import { User } from '@prisma/client';

export const setCryptoPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(Number(BCRYPT_SALT));
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (
  password: string,
  dbPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, dbPassword);
};

export const validateFields = (data: UserData): void => {
  const { error } = registerValidationSchema.validate(data);

  if (error) {
    const name = error.details[0].context?.label;
    throw new ValidationError(`${name} is not valid`);
  }
};

export const getAccessAndRefreshTokens = (id: number): Tokens => {
  const aToken = accessToken.create(id);
  const rToken = refreshToken.create(id);

  const expDate = Date.now() + accessToken.expiresIn * 1000;

  return {
    accessToken: aToken,
    expiry: expDate,
    refreshToken: rToken,
  };
};

type AccessTokenObject = {
  accessToken: string;
  expiry: number;
};

export const getNewAccessTokenWithExpiry = (
  rToken: string,
): AccessTokenObject => {
  const refreshPayload = refreshToken.decodeAndVerify(rToken);

  if (refreshPayload.err) {
    throw new AuthError(refreshPayload.err.message);
  }

  const aToken = accessToken.create(refreshPayload.id);

  const expiry = Date.now() + accessToken.expiresIn * 1000;

  return {
    accessToken: aToken,
    expiry,
  };
};

export const setResponseUser = (user: User): ResponseUser => {
  const { displayName, email, facebookId, googleId, id } = user;
  const userForResponse: ResponseUser = {
    displayName,
    email,
    facebookId,
    googleId,
    id,
  };
  return userForResponse;
};
