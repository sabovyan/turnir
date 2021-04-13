import { Router } from 'express';
import {
  createTournament,
  deleteTournamentById,
  getAllTournaments,
  getTournamentById,
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

export default tournamentRouter;
