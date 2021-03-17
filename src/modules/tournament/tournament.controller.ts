import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import { IRequest } from '../../types/main';
import tournamentService from './tournament.service';
import { ICreateTournamentRequestBody } from './tournament.type';

export const createTournament = asyncWrapper(
  async (
    req: IRequest<ICreateTournamentRequestBody>,
    res: Response,
  ): Promise<void> => {
    const data = req.body;

    const tournament = await tournamentService.create(data);

    res.status(200).json(tournament);
  },
);
