import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import {
  createTournament,
  getTournamentWithPlayersAndGames,
} from './tournament.controller';

const tournamentRouter = Router();

// tournamentRouter.use(authenticateUser);

tournamentRouter.route('/').post(createTournament);

tournamentRouter.route('/:id').get(getTournamentWithPlayersAndGames);

export default tournamentRouter;
