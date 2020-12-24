import { Console } from 'console';
import { Request, Response, Router } from 'express';
import Token from '../config/token';
import RegistrationError from '../errors/registrationError';
import asyncWrapper from '../middleware/AsyncWrapper';
import {
  registerUserWithEmail,
  confirmEmailRegistration,
} from './user.controller';
import UserModel from './user.model';

const userRouter = Router();
const registerRoute = userRouter.route('/register');

registerRoute.post(registerUserWithEmail);

const confirmationRoute = userRouter.route('/confirmation/:token');

confirmationRoute.post(confirmEmailRegistration);

export default userRouter;
