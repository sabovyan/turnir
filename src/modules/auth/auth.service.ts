import { Request, Response } from 'express';
import { accessToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import asyncWrapper from '../../middleware/AsyncWrapper';
import UserModel from '../user/user.model';

class AuthService {
  // eslint-disable-next-line class-methods-use-this
  async autoLogin(token: string) {
    if (!token) throw new AuthError('Token is missing!');

    const result = accessToken.decodeAndVerify(token);
    if (result.err) throw new AuthError(result.err.message);

    const user = await UserModel.getUserById(result.id);
    if (!user) throw new AuthError('User is not registered');
    return user;
  }
}

const sharedAuthService = new AuthService();

export default sharedAuthService;
