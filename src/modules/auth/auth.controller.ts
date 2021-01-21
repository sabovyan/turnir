import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import localAuthService from './localAuth.service';
import {
  RequestDataForFacebookLogin,
  RequestDataForGoogleLogin,
  UserData,
} from './auth.types';
import { getNewAccessTokenWithExpiry, validateFields } from './auth.utils';
import facebookAuth from './facebookAuth.service';
import googleAuth from './googleAuth.service';
import sharedAuthService from './auth.service';

export const register = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body as UserData;

    validateFields({ email, password, displayName });

    await localAuthService.register({
      email: email.toLowerCase().trim(),
      password,
      displayName: displayName.trim(),
    });

    const response = {
      message: 'Email is sent',
    };

    res.status(200).json(response);
  },
);

export const confirmEmailRegistration = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    await localAuthService.verifyUserEmail(token);

    const response = {
      message: 'verification is done',
    };

    res.status(200).json(response);
  },
);

export const resendRegisterEmail = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email } = req.body as UserData;

    await localAuthService.resendEmail(email);

    const response = {
      message: 'Another Email is sent',
    };

    res.status(200).json(response);
  },
);

export const loginWithEmail = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response = await localAuthService.loginWithEmail(email, password);
    /* ANCHOR place it back to response json */

    res.status(200).json(response);
  },
);

export const refreshAccessToken = asyncWrapper(
  (req: Request, res: Response): void => {
    const rToken = req.body.token;
    // console.log(rToken);

    const accessTokenWithExpiry = getNewAccessTokenWithExpiry(rToken);

    res.status(200).send(accessTokenWithExpiry);
  },
);

export const googleSignIn = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data: RequestDataForGoogleLogin = req.body;

    const tokens = await googleAuth.login(data);

    res.status(200).json(tokens);
  },
);

export const facebookSignIn = asyncWrapper(
  async (req: Request, res: Response) => {
    const data = req.body as RequestDataForFacebookLogin;

    const tokens = await facebookAuth.login(data);

    res.status(200).json(tokens);
  },
);

export const autoLogin = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    const user = await sharedAuthService.autoLogin(token);

    res.status(200).json(user);
  },
);
