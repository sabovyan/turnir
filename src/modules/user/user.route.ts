import { Router } from 'express';
import authenticateUser from '../../middleware/authenticate';
import { getGroupsAndPlayersByUserId } from './user.controller';

const userRouter = Router();

userRouter.use(authenticateUser);

userRouter.route('/:id').get(getGroupsAndPlayersByUserId);

export default userRouter;
