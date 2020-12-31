import { User } from '@prisma/client';
import { UserData } from './auth.types';
import { verificationToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import sgMail, { setMessage } from '../../config/sendGrid';
import UserModel from '../user/user.model';
import { setCryptoPassword } from './auth.utils';

type dataForVerifying = {
  verified: boolean;
};

type TokenInfo = {
  verificationToken: string;
};

class AuthService {
  static async registerNewUser(data: UserData): Promise<void> {
    const existingUser = await UserModel.getUserByEmail(data.email);
    if (existingUser) {
      throw new AuthError('this email is already registered');
    }

    const dataWithCryptedPassword: UserData = {
      ...data,
      password: setCryptoPassword(data.password),
    };

    const newUser = await UserModel.createUser(dataWithCryptedPassword);

    const token = verificationToken.create(newUser.id);

    await AuthService.addVerificationTokenToUser(newUser.id, {
      verificationToken: token,
    });

    await AuthService.sendMail(newUser.email, newUser.displayName, token);
  }

  static async addVerificationTokenToUser(
    id: number,
    data: TokenInfo,
  ): Promise<User> {
    const user = await UserModel.updateUserById(id, data);

    return user;
  }

  static async sendMail(
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

  static updateVerificationStatus(
    id: number,
    data: dataForVerifying,
  ): Promise<User> {
    return UserModel.updateUserById(id, data);
  }

  static async verifyUserEmail(token: string): Promise<void> {
    const decoded = verificationToken.decodeToken(token);
    const user = await UserModel.getUserById(decoded.id);

    if (!user) {
      throw new AuthError('unauthorized');
    }

    if (user.verified) {
      throw new AuthError('your email is already verified');
    }

    if (token !== user.verificationToken) {
      throw new AuthError('A wrong link is used');
    }

    await AuthService.updateVerificationStatus(user.id, { verified: true });
  }

  static async resendEmail(email: string): Promise<void> {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw new AuthError('your email is not registered');
    }

    if (user.verified) {
      throw new AuthError('your email is already verified');
    }

    const token = verificationToken.create(user.id);

    await AuthService.addVerificationTokenToUser(user.id, {
      verificationToken: token,
    });

    await AuthService.sendMail(user.email, user.displayName, token);
  }
}

export default AuthService;
