import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import {
  getAllPlayers,
  createNewPlayer,
  deletePlayerById,
  updatePlayerName,
  updatePlayerGroup,
} from './players.controller';

const playersRouter = Router();

playersRouter.use(authenticateUser);

playersRouter
  .route('/')
  .get(getAllPlayers)
  .post(createNewPlayer)
  .put(updatePlayerName);
playersRouter.route('/:id').delete(deletePlayerById);
playersRouter.route('/updateGroup').post(updatePlayerGroup);

export default playersRouter;
