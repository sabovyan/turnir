import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import playerGroupService from './playerGroup.service';

export const getAllPlayerGroups = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const groups = await playerGroupService.getAllGroups(userId);

    res.status(200).json(groups);
  },
);

export const getGroupById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const group = await playerGroupService.getGroupByGroupId(id);

    res.status(200).json(group);
  },
);

export const createNewGroup = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId, name } = req.body;
    const group = await playerGroupService.createNewGroup({ userId, name });

    res.status(200).json(group);
  },
);
