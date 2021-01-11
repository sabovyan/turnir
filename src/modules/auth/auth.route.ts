import { Router } from 'express';

import {
  register,
  confirmEmailRegistration,
  resendRegisterEmail,
  loginWithEmail,
  refreshAccessToken,
  googleSignIn,
} from './auth.controller';

const authRouter = Router();

authRouter.route('/email').post(register);

authRouter.route('/email/confirmation/').post(confirmEmailRegistration);

authRouter.route('/email/resend').post(resendRegisterEmail);

authRouter.route('/email/login').post(loginWithEmail);

authRouter.route('/email/refreshToken').get(refreshAccessToken);

authRouter.route('/google').post(googleSignIn);

export default authRouter;
