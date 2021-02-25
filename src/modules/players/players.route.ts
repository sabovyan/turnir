import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import { getAllPlayers, createNewPlayer } from './players.controller';

const playersRouter = Router();

// playersRouter.use(authenticateUser);

playersRouter.route('/').get(getAllPlayers);
playersRouter.route('/').post(createNewPlayer);

export default playersRouter;
