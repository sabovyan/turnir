import { User } from '@prisma/client';
import { LoginResponse, UserData } from './auth.types';
import { verificationToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import sgMail, { setMessage } from '../../config/sendGrid';
import UserModel from '../user/user.model';
import {
  comparePassword,
  getAccessAndRefreshTokens,
  setCryptoPassword,
} from './auth.utils';

type dataForVerifying = {
  verified: boolean;
};

type TokenInfo = {
  verificationToken: string;
};

class LocalAuthService {
  async register(data: UserData): Promise<User> {
    const existingUser = await UserModel.getUserByEmail(data.email);
    if (existingUser) throw new AuthError('this email is already registered');

    const dataWithCryptedPassword: UserData = {
      ...data,
      password: setCryptoPassword(data.password),
    };

    const newUser = await UserModel.createUser(dataWithCryptedPassword);

    const token = verificationToken.create(newUser.id);

    await this.addVerificationTokenToUser(newUser.id, {
      verificationToken: token,
    });

    await this.sendMail(newUser.email, newUser.displayName, token);

    return newUser;
  }

  // eslint-disable-next-line class-methods-use-this
  async addVerificationTokenToUser(id: number, data: TokenInfo): Promise<User> {
    const user = await UserModel.updateUserById(id, data);
    return user;
  }

  // eslint-disable-next-line class-methods-use-this
  async sendMail(
    to: string,
    displayName: string,
    token: string,
  ): Promise<void> {
    await sgMail.send(setMessage(to, displayName, token), false, (err) => {
      if (err) {
        throw new AuthError('Mailing error');
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateVerificationStatus(id: number, data: dataForVerifying): Promise<User> {
    return UserModel.updateUserById(id, data);
  }

  async verifyUserEmail(token: string): Promise<void> {
    if (!token) throw new AuthError('invalid token or email');

    const decoded = verificationToken.decodeToken(token);
    if (decoded.err) throw new AuthError(decoded.err.message);

    const user = await UserModel.getUserById(decoded.id);
    if (!user) throw new AuthError('unauthorized request');

    if (user.verified) throw new AuthError('your email is already verified');

    if (token !== user.verificationToken)
      throw new AuthError('A wrong link is used');

    await this.updateVerificationStatus(user.id, { verified: true });
  }

  async resendEmail(email: string): Promise<void> {
    const user = await UserModel.getUserByEmail(email);

    if (!user) throw new AuthError('your email is not registered');
    if (user.verified) throw new AuthError('your email is already verified');

    const token = verificationToken.create(user.id);

    await this.addVerificationTokenToUser(user.id, {
      verificationToken: token,
    });

    await this.sendMail(user.email, user.displayName, token);
  }

  // eslint-disable-next-line class-methods-use-this
  async loginWithEmail(
    email: string,
    password: string,
  ): Promise<LoginResponse> {
    const user = await UserModel.getUserByEmail(email);

    if (!user) throw new AuthError('email is not registered');

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) throw new AuthError('your password is not correct');

    const tokens = getAccessAndRefreshTokens(user.id);

    return tokens;
  }
}

const localAuthService = new LocalAuthService();

export default localAuthService;
