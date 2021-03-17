import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import { resetPassword } from '../auth/auth.controller';
import {
  DisconnectPlayersRequest,
  UpdateManyPlayersOfGroupRequest,
  updateOnePlayersConnectionToAGroupRequest,
} from './group.type';
import playerGroupService from './group.service';
import { IRequest } from '../../types/main';

export const getAllPlayerGroups = asyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const groups = await playerGroupService.getAllGroups(id);

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

export const deleteGroupById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const group = await playerGroupService.deleteGroupById(id);

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

export const updateGroupNameById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId, name, groupId } = req.body;
    const group = await playerGroupService.updateGroupNameById({
      userId,
      name,
      groupId,
    });

    res.status(200).json(group);
  },
);

export const updateManyPlayersInGroup = asyncWrapper(
  async (req: Request, res: Response) => {
    const { groupId, playerIds } = req.body as UpdateManyPlayersOfGroupRequest;
    const group = await playerGroupService.updateManyPlayersConnectionInGroup({
      groupId,
      playerIds,
    });

    res.status(200).json(group);
  },
);

export const addOnePlayerToGroup = asyncWrapper(
  async (req: Request, res: Response) => {
    const {
      groupId,
      playerId,
    } = req.body as updateOnePlayersConnectionToAGroupRequest;

    const group = await playerGroupService.updateOnePlayersConnectionToGroup({
      groupId,
      playerId,
    });

    res.status(200).json(group);
  },
);

export const removePlayerFromGroup = asyncWrapper(
  async (req: IRequest<DisconnectPlayersRequest>, res: Response) => {
    const data = req.body;

    const group = await playerGroupService.disconnectPlayerById(data);
    res.status(200).json(group);
  },
);
