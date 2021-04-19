import { Router } from 'express';
import {
  createTournament,
  deleteTournamentById,
  getAllTournaments,
  getTournamentById,
  updateTournamentGameScore,
  updateTournamentNameById,
} from './tournament.controller';
import authenticateUser from '../../middleware/authenticate';

const tournamentRouter = Router();

tournamentRouter.use(authenticateUser);

tournamentRouter.route('/').get(getAllTournaments).post(createTournament);

tournamentRouter
  .route('/:id')
  .get(getTournamentById)
  .put(updateTournamentNameById)
  .delete(deleteTournamentById);

tournamentRouter.route('/game/:id').put(updateTournamentGameScore);

export default tournamentRouter;
