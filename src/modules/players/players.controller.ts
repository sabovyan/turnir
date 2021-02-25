import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import playersService from './players.service';

export const getAllPlayers = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const players = await playersService.getPlayers(userId);
    res.status(200).json(players);
  },
);
export const createNewPlayer = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId, name } = req.body;

    const players = await playersService.createPlayer({ userId, name });

    res.status(200).json(players);
  },
);
