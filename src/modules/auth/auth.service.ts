import { accessToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import UserModel from '../user/user.model';
import { ResponseUser } from './auth.types';
import { setResponseUser } from './auth.utils';

class AuthService {
  // eslint-disable-next-line class-methods-use-this
  async autoLogin(token: string): Promise<ResponseUser> {
    if (!token) throw new AuthError('Token is missing!');

    const result = accessToken.decodeAndVerify(token);

    if (result.err) throw new AuthError(result.err.message);

    const user = await UserModel.getUserById(result.id);
    if (!user) throw new AuthError('User is not registered');

    const responseUser: ResponseUser = setResponseUser(user);

    return responseUser;
  }
}

const sharedAuthService = new AuthService();

export default sharedAuthService;
