import { Request, Response } from 'express';
import RegistrationError from '../errors/registrationError';
import asyncWrapper from '../middleware/AsyncWrapper';
import UserService from './user.service';
import { validateFields } from './user.utils';

export const registerUserWithEmail = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      throw new RegistrationError('please fill in all the fields');
    }

    validateFields({ email, password, displayName });

    await UserService.registerNewUser({ email, password, displayName });

    const response = {
      success: true,
      data: { name: displayName, email },
    };

    res.status(200).json(response);
  },
);

export const confirmEmailRegistration = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    if (!token) {
      throw new RegistrationError('invalid token or email');
    }
    await UserService.verifyUserEmail(token);

    const response = {
      success: true,
      message: 'verification is done',
    };

    res.status(200).json(response);
  },
);
