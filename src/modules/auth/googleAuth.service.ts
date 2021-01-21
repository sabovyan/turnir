import { FAKE_PASS, GOOGLE_CLIENT_ID } from '../../config/envConstants';

import AuthError from '../../errors/AuthError';
import oAuth2Client from '../../lib/googleOAuth';
import UserModel from '../user/user.model';
import {
  ISocialAccountLogin,
  LoginResponse,
  RequestDataForGoogleLogin,
  ResponseUser,
} from './auth.types';
import {
  getAccessAndRefreshTokens,
  setCryptoPassword,
  setResponseUser,
} from './auth.utils';

class GoogleAuth implements ISocialAccountLogin<RequestDataForGoogleLogin> {
  private audience: string;

  constructor() {
    this.audience = GOOGLE_CLIENT_ID;
  }

  private async debugToken(token: string): Promise<void> {
    try {
      await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: this.audience,
      });
    } catch (error) {
      throw new AuthError(error.message);
    }
  }

  async login(data: RequestDataForGoogleLogin): Promise<LoginResponse> {
    const { googleId, email, name, tokenId } = data;

    await this.debugToken(tokenId);

    let user = await UserModel.getUserByEmail(email);
    if (user) {
      if (!user.googleId) {
        await UserModel.updateUserById(user.id, {
          googleId,
          verified: true,
        });
      }
    } else {
      const password = setCryptoPassword(
        Buffer.from(FAKE_PASS, 'base64').toString(),
      );

      user = await UserModel.createUser({
        email,
        googleId,
        displayName: name,
        password,
      });
    }

    const userForResponse: ResponseUser = setResponseUser(user);

    const tokens = getAccessAndRefreshTokens(user.id);

    return { ...tokens, user: userForResponse };
  }
}

const googleAuth = new GoogleAuth();

export default googleAuth;

// static async authenticateWithGoogle(token: string): Promise<LoginResponse> {
//   const ticket = await oAuth2Client.verifyIdToken({
//     idToken: token,
//     audience: GOOGLE_CLIENT_ID,
//   });

//   const { name, email } = ticket.getPayload()!;
//   const googleId = ticket.getUserId();

//   if (!email || !name || !googleId) throw new AuthError('missing fields');

//   let user = await UserModel.getUserByEmail(email);

//   if (user) {
//     if (!user.googleId) {
//       UserModel.updateUserById(user.id, { googleId, verified: true });
//     }
//   } else {
//     const password = setCryptoPassword(
//       Buffer.from(FAKE_PASS, 'base64').toString(),
//     );

//     user = await UserModel.createUser({
//       email,
//       password: password.toString(),
//       displayName: name,
//       googleId,
//       verified: true,
//     });
//   }

//   const aToken = accessToken.create(user.id);
//   const expDate = Date.now() + accessToken.expiresIn;
//   const rToken = refreshToken.create(user.id);

//   return {
//     accessToken: aToken,
//     expiry: expDate,
//     refreshToken: rToken,
//   };
// }
