import fetch from 'node-fetch';
import { FACEBOOK_APP_ID, FAKE_PASS } from '../../config/envConstants';
import AuthError from '../../errors/AuthError';
import UserModel from '../user/user.model';
import {
  IResponseBodyFromGraphApi,
  ISocialAccountLogin,
  LoginResponse,
  RequestDataForFacebookLogin,
} from './auth.types';
import { getAccessAndRefreshTokens, setCryptoPassword } from './auth.utils';

class FacebookAuth implements ISocialAccountLogin<RequestDataForFacebookLogin> {
  debugURL: string;

  constructor() {
    this.debugURL = 'https://graph.facebook.com/debug_token?';
  }

  private async debugToken(token: string) {
    const tokenParams = `input_token=${token}&access_token=${token}`;
    const url = `${this.debugURL}${tokenParams}`;

    const response = await fetch(url, { method: 'get' });
    const body: IResponseBodyFromGraphApi = await response.json();

    const { data } = body;
    const { error } = body;

    if (error) throw new AuthError(error.message);

    if (data.app_id !== FACEBOOK_APP_ID)
      throw new AuthError('unauthorized Request');

    if (!data.is_valid) throw new AuthError('unauthorized Request');
  }

  // eslint-disable-next-line class-methods-use-this
  async login(data: RequestDataForFacebookLogin): Promise<LoginResponse> {
    const { id, accessToken: token, name, email } = data;

    this.debugToken(token);

    let user = await UserModel.getUserByEmail(email);
    if (user) {
      if (!user.facebookId) {
        await UserModel.updateUserById(user.id, {
          facebookId: id,
          verified: true,
        });
      }
    } else {
      const password = setCryptoPassword(
        Buffer.from(FAKE_PASS, 'base64').toString(),
      );

      user = await UserModel.createUser({
        email,
        facebookId: id,
        displayName: name,
        password,
      });
    }

    const tokens = getAccessAndRefreshTokens(user.id);

    return tokens;
  }
}

const facebookAuth = new FacebookAuth();

export default facebookAuth;
