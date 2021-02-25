import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import {
  createNewGroup,
  getAllPlayerGroups,
  getGroupById,
} from './playerGroup.controller';

const playerGroupRouter = Router();

playerGroupRouter.use(authenticateUser);
playerGroupRouter.route('/').post(createNewGroup);
playerGroupRouter.route('/').get(getAllPlayerGroups);
playerGroupRouter.route('/:id').get(getGroupById);

export default playerGroupRouter;
