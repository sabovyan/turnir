import { Request, Response } from 'express';

import asyncWrapper from '../../middleware/AsyncWrapper';
import { updatePlayerGroupRequest } from './player.type';

import playersService from './players.service';

export const getAllPlayers = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const players = await playersService.getAllPlayers(userId);
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

export const deletePlayerById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const player = await playersService.deletePlayerById(id);

    res.status(200).json(player);
  },
);

export const updatePlayerName = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id, name, userId } = req.body;

    const player = await playersService.updatePlayerName({ id, name, userId });

    res.status(200).json(player);
  },
);

export const updatePlayerGroup = asyncWrapper(
  async (req: Request, res: Response) => {
    const { groupId, playerId } = req.body as updatePlayerGroupRequest;

    const player = await playersService.updatePlayerGroup({
      groupId,
      playerId,
    });

    res.status(200).json(player);
  },
);
