import { Router } from 'express';
import {
  addOnePlayerToGroup,
  createNewGroup,
  deleteGroupById,
  getAllPlayerGroups,
  getGroupById,
  removePlayerFromGroup,
  updateGroupNameById,
  updateManyPlayersInGroup,
} from './group.controller';

const groupRouter = Router();

// playerGroupRouter.use(authenticateUser);
groupRouter.route('/').post(createNewGroup).put(updateGroupNameById);

groupRouter.route('/all/:id').get(getAllPlayerGroups);
groupRouter.route('/:id').get(getGroupById);
groupRouter.route('/:id').delete(deleteGroupById);

groupRouter.route('/addPlayers').put(updateManyPlayersInGroup);

groupRouter.route('/addOnePlayer').put(addOnePlayerToGroup);

groupRouter.route('/removePlayer').put(removePlayerFromGroup);

export default groupRouter;
