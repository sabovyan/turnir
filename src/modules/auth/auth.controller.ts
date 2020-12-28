import { Request, Response } from 'express';
import RegistrationError from '../../errors/registrationError';
import asyncWrapper from '../../middleware/AsyncWrapper';
import AuthService from './auth.service';
import { UserData } from './auth.types';
import { validateFields } from './auth.utils';

export const register = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body;

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
      throw new RegistrationError('invalid token or email');
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
