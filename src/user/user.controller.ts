import { Request, Response } from 'express';
import asyncWrapper from '../middleware/AsyncWrapper';
import User from './user.model';

export const registerUserWithEmail = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, displayName } = req.body;
    const newUser = new User(email, password, displayName);

    await newUser.register();

    res
      .status(200)
      .json({ userName: newUser.data.displayName, email: newUser.data.email });
  },
);
