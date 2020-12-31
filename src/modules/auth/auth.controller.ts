import { Request, Response } from 'express';
import { accessToken, refreshToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import asyncWrapper from '../../middleware/AsyncWrapper';
import UserModel from '../user/user.model';
import AuthService from './auth.service';
import { UserData } from './auth.types';
import { comparePassword, validateFields } from './auth.utils';

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

    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      throw new AuthError('email is not registered');
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new AuthError('your password is not correct');
    }

    const aToken = accessToken.create(user.id);
    const rToken = refreshToken.create(user.id);

    res.send('200');
  },
);
