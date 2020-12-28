import { Request, Response, Router } from 'express';

import {
  register,
  confirmEmailRegistration,
  resendRegisterEmail,
} from './auth.controller';
import AuthService from './auth.service';

const authRouter = Router();

authRouter.route('/email').post(register);

authRouter.route('/email/confirmation/').post(confirmEmailRegistration);

authRouter.route('/email/resend').post(resendRegisterEmail);
authRouter.route('/email/force').post((req: Request, res: Response) => {
  AuthService.registerNewUser(req.body);
});

export default authRouter;
