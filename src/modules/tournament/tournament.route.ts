import { Request, Response, Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import { getTournaments } from './tournament.controller';

const tournamentRouter = Router();

tournamentRouter.use(authenticateUser);

tournamentRouter.route('/').get(getTournaments);

export default tournamentRouter;
