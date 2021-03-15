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
  console.log({ tournamentData });

  const numberOfGames = getNumberOfGames(playersData);

  const tournament = await tournamentModel.create(tournamentData, playersData);

  res.status(200).json(tournament);
  // res.status(200).send('hi');
};
// export const getTournamentWithPlayersAndGames = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   const tournamentId = Number(req.params.id);

//   const tournamentWithEverything = await tournamentModel.getTournamentWithPlayersAndGames(
//     tournamentId,
//   );

//   res.status(200).json(tournamentWithEverything);
//   // res.end();
// };
