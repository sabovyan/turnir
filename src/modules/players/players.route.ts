import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import {
  getAllPlayers,
  createNewPlayer,
  deletePlayerById,
  updatePlayerName,
} from './players.controller';

const playersRouter = Router();

playersRouter.use(authenticateUser);

playersRouter
  .route('/')
  .get(getAllPlayers)
  .post(createNewPlayer)
  .put(updatePlayerName);
playersRouter.route('/:id').delete(deletePlayerById);

export default playersRouter;
