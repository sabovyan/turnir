import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import { IRequest, OnlyName, RequestWithUser } from '../../types';
import tournamentService from './tournament.service';
import { ICreateTournament, IUpdateTournamentGame } from './tournament.type';

export const createTournament = asyncWrapper(
  async (req: IRequest<ICreateTournament>, res: Response): Promise<void> => {
    const data = req.body;

    const tournament = await tournamentService.create(data);

    res.status(200).json(tournament);
  },
);

export const getAllTournaments = asyncWrapper(
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) return;
    const { id } = req.user;

    const allTournaments = await tournamentService.getAll({
      id,
    });

    res.status(200).json(allTournaments);
  },
);

export const getTournamentById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const tournament = await tournamentService.getById({ id: Number(id) });

    res.status(200).json(tournament);
  },
);

export const updateTournamentNameById = asyncWrapper(
  async (req: IRequest<OnlyName>, res: Response) => {
    const { id } = req.params;

    const data = req.body;

    const tournament = await tournamentService.updateNameById({
      id: Number(id),
      data,
    });

    res.status(200).json(tournament);
  },
);
export const deleteTournamentById = asyncWrapper(
  async (req: IRequest<OnlyName>, res: Response) => {
    const { id } = req.params;

    const tournament = await tournamentService.deleteById({
      id: Number(id),
    });

    res.status(200).json(tournament);
  },
);

export const updateTournamentGameScore = asyncWrapper(
  async (req: IRequest<IUpdateTournamentGame>, res: Response) => {
    const { id } = req.params;
    const {
      firstParticipantScore,
      secondParticipantScore,
      tournamentId,
    } = req.body;

    const gameId = Number(id);

    const updatedGames = await tournamentService.updateGameScoreAndNextGameParticipant(
      { gameId, firstParticipantScore, secondParticipantScore, tournamentId },
    );

    res.status(200).json(updatedGames);
  },
);
