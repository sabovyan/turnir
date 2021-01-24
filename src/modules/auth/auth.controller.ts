import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import localAuthService from './localAuth.service';
import {
  ChangePasswordData,
  RequestDataForFacebookLogin,
  RequestDataForGoogleLogin,
  UserData,
  ResetPassword,
  setNewPassWordData,
} from './auth.types';
import { getNewAccessTokenWithExpiry, validateFields } from './auth.utils';
import facebookAuth from './facebookAuth.service';
import googleAuth from './googleAuth.service';
import sharedAuthService from './auth.service';
import { Language } from '../../lang/lang';

export const register = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body as UserData;

    const lang = req.query.lang as Language;

    validateFields({ email, password, displayName });

    await localAuthService.register(
      {
        email: email.toLowerCase().trim(),
        password,
        displayName: displayName.trim(),
      },
      lang,
    );

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
    const lang = req.query.lang as Language;

    await localAuthService.resendEmail(email, lang);

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

    res.status(200).json(response);
  },
);

export const refreshAccessToken = asyncWrapper(
  (req: Request, res: Response): void => {
    const rToken = req.body.token;

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

export const updatePasswordByUserId = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as ChangePasswordData;

    await localAuthService.changePassword(data);

    res.status(200).send('Your password is changed');
  },
);
export const resetPassword = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as ResetPassword;

    const lang = req.query.lang as Language;
    await localAuthService.resetPassword(data, lang);

    res.status(200).send('The email is sent. please check out your inbox');
  },
);

export const confirmNewPassword = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data: setNewPassWordData = req.body;

    await localAuthService.confirmNewPassword(data);

    res.status(200).send('Your New Password is confirmed');
  },
);
