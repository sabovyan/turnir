import { Router } from 'express';

import {
  register,
  confirmEmailRegistration,
  resendRegisterEmail,
  loginWithEmail,
  refreshAccessToken,
  googleSignIn,
  facebookSignIn,
  autoLogin,
} from './auth.controller';

const authRouter = Router();

authRouter.route('/email').post(register);

authRouter.route('/email/confirmation/').post(confirmEmailRegistration);

authRouter.route('/email/resend').post(resendRegisterEmail);

authRouter.route('/email/login').post(loginWithEmail);

authRouter.route('/auto-login').post(autoLogin);

authRouter.route('/email/refreshToken').post(refreshAccessToken);

authRouter.route('/google').post(googleSignIn);

authRouter.route('/facebook').post(facebookSignIn);

export default authRouter;
