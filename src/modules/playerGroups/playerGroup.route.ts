import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import {
  addOnePlayerToGroup,
  createNewGroup,
  deleteGroupById,
  getAllPlayerGroups,
  getGroupById,
  removePlayerFromGroup,
  updateGroupNameById,
  updateManyPlayersInGroup,
} from './playerGroup.controller';

const playerGroupRouter = Router();

// playerGroupRouter.use(authenticateUser);
playerGroupRouter.route('/').post(createNewGroup).put(updateGroupNameById);

playerGroupRouter.route('/all/:id').get(getAllPlayerGroups);
playerGroupRouter.route('/:id').get(getGroupById);
playerGroupRouter.route('/:id').delete(deleteGroupById);

playerGroupRouter.route('/addPlayers').put(updateManyPlayersInGroup);

playerGroupRouter.route('/addOnePlayer').put(addOnePlayerToGroup);

playerGroupRouter.route('/removePlayer').put(removePlayerFromGroup);

export default playerGroupRouter;
