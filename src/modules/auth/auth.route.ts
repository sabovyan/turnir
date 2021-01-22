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
  updatePasswordByUserId,
  resetPassword,
  confirmNewPassword,
} from './auth.controller';

const authRouter = Router();

authRouter.route('/email').post(register);
authRouter.route('/email/confirmation/').post(confirmEmailRegistration);
authRouter.route('/email/resend').post(resendRegisterEmail);
authRouter.route('/email/login').post(loginWithEmail);
authRouter.route('/email/refreshToken').post(refreshAccessToken);
authRouter.route('/email/update-password').put(updatePasswordByUserId);
authRouter.route('/email/reset-password').post(resetPassword);
authRouter.route('/email/confirm-password').post(confirmNewPassword);

authRouter.route('/google').post(googleSignIn);
authRouter.route('/facebook').post(facebookSignIn);
authRouter.route('/auto-login').post(autoLogin);

export default authRouter;
