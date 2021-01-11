import { Request, Response } from 'express';
import AuthError from '../../errors/AuthError';
import asyncWrapper from '../../middleware/AsyncWrapper';
import AuthService from './auth.service';
import { UserData } from './auth.types';
import { validateFields } from './auth.utils';

export const register = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body as UserData;

    validateFields({ email, password, displayName });

    await AuthService.registerNewUser({ email, password, displayName });

    const response = {
      success: true,
      data: { name: displayName, email },
    };

    res.status(200).json(response);
  },
);

export const confirmEmailRegistration = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    if (!token) {
      throw new AuthError('invalid token or email');
    }

    await AuthService.verifyUserEmail(token);

    const response = {
      success: true,
      message: 'verification is done',
    };

    res.status(200).json(response);
  },
);

export const resendRegisterEmail = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email } = req.body as UserData;

    AuthService.resendEmail(email);

    const response = {
      success: true,
      message: 'email is sent',
    };

    res.status(200).json(response);
  },
);

export const loginWithEmail = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const {
      accessToken,
      refreshToken,
      expiresIn,
    } = await AuthService.loginWithEmail(email, password);

    res.cookie('refresh_token', refreshToken, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({
      accessToken,
      expiresIn,
    });
  },
);

export const refreshAccessToken = asyncWrapper(
  (req: Request, res: Response): void => {
    const rToken = req.cookies.refresh_token;

    const { accessToken, expiresIn } = AuthService.refreshAccessToken(rToken);

    res.status(200).send({
      accessToken,
      expiresIn,
    });
  },
);

export const googleSignIn = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    const user = await AuthService.authenticateWithGoogle(token);

    const response = {
      status: 'success',
      data: user,
    };

    res.status(200).json(response);
  },
);
