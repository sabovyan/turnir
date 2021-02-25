import { Player, Tournament } from '@prisma/client';
import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import tournamentModel from './tournament.model';
import { getNumberOfGames } from './tournament.util';

export const createTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const tournamentData = req.body.tournament as Tournament;
  const playersData = req.body.players as Omit<Player, 'id'>[];

  // const numberOfGames = getNumberOfGames(playersData.length);

  const tournament = await tournamentModel.createTournamentWithPlayers(
    tournamentData,
    playersData,
  );

  res.status(200).json(tournament);
};
export const getTournamentWithPlayersAndGames = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const tournamentId = Number(req.params.id);

  const tournamentWithEverything = await tournamentModel.getTournamentWithPlayersAndGames(
    tournamentId,
  );

  res.status(200).json(tournamentWithEverything);
  // res.end();
};
