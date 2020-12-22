import { Request, Response } from 'express';
import asyncWrapper from '../middleware/AsyncWrapper';
import User from './user.class';

export const registerUserWithEmail = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, userName } = req.body;

    const newUser = new User(email, password, userName);

    await newUser.register();

    res.status(200).json(newUser);
  },
);
