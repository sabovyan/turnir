import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import userService from './user.service';

export const getGroupsAndPlayersByUserId = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const groupsAndPlayers = await userService.getAllGroupsAndPlayers(id);

    res.status(200).json(groupsAndPlayers);
  },
);
