import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { GOOGLE_CLIENT_ID } from '../config/envConstants';
import AuthError from '../errors/AuthError';
import oAuth2Client from '../lib/googleOAuth';
import asyncWrapper from '../middleware/AsyncWrapper';
import UserModel from '../modules/user/user.model';

const testRoute = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    res.cookie('value', 14, { maxAge: 900000, httpOnly: false });
    // res.setHeader(
    //   'Set-Cookie',
    //   cookie.serialize('token', 14, {
    //     maxAge: 60 * 60 * 24 * 7, // 1 week
    //   }),
    // );'

    res.cookie('value', '14', { maxAge: 900000, httpOnly: false });
    res.end();
  },
);

export const testRouteWithToken = asyncWrapper(
  (req: Request, res: Response): void => {
    res.end();
  },
);

export default testRoute;
