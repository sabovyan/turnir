import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { GOOGLE_CLIENT_ID } from '../config/envConstants';
import AuthError from '../errors/AuthError';
import oAuth2Client from '../lib/googleOAuth';
import asyncWrapper from '../middleware/AsyncWrapper';
import UserModel from '../modules/user/user.model';

const testRoute = asyncWrapper(
  async (req: Request, res: Response): Promise<User | null | void> => {
    const { token } = req.body;

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload()!;

    if (!email || !name) {
      throw new AuthError('Bad Request');
    }

    const existingUser = await UserModel.getUserByEmail(email);

    if (existingUser) {
      return existingUser;
    }

    const password = Buffer.from('test', 'base64');

    const user = await UserModel.createUser({
      email,
      password: password.toString(),
      displayName: name,
    });

    return user;
  },
);

export const testRouteWithToken = asyncWrapper(
  (req: Request, res: Response): void => {
    res.json('here');
  },
);

export default testRoute;
