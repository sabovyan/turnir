import { User } from '@prisma/client';
import { UserData } from './auth.types';
import {
  accessToken,
  refreshToken,
  verificationToken,
} from '../../config/token';
import AuthError from '../../errors/AuthError';
import sgMail, { setMessage } from '../../config/sendGrid';
import UserModel from '../user/user.model';
import { comparePassword, setCryptoPassword } from './auth.utils';
import oAuth2Client from '../../lib/googleOAuth';
import { FAKE_PASS, GOOGLE_CLIENT_ID } from '../../config/envConstants';

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

    if (decoded.err) throw new AuthError(decoded.err.message);

    const user = await UserModel.getUserById(decoded.id);

    if (!user) throw new AuthError('unauthorized request');

    if (user.verified) throw new AuthError('your email is already verified');

    if (token !== user.verificationToken)
      throw new AuthError('A wrong link is used');

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

  static async loginWithEmail(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      throw new AuthError('email is not registered');
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new AuthError('your password is not correct');
    }

    const aToken = accessToken.create(user.id);
    const rToken = refreshToken.create(user.id);

    const expDate = Date.now() + accessToken.expiresIn;

    return {
      accessToken: aToken,
      expiresIn: expDate,
      refreshToken: rToken,
    };
  }

  static refreshAccessToken(
    rToken: string,
  ): {
    accessToken: string;
    expiresIn: string | number;
  } {
    const refreshPayload = refreshToken.decodeAndVerify(rToken);

    if (refreshPayload.err) {
      throw new AuthError(refreshPayload.err.message);
    }

    const aToken = accessToken.create(refreshPayload.id);

    const expDate = Date.now() + accessToken.expiresIn;

    return {
      accessToken: aToken,
      expiresIn: expDate,
    };
  }

  static async authenticateWithGoogle(token: string): Promise<User> {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload()!;
    const googleId = ticket.getUserId();

    if (!email || !name || !googleId) {
      throw new AuthError('missing fields');
    }

    const existingUser = await UserModel.getUserByEmail(email);

    if (existingUser) {
      if (!existingUser.googleId) {
        UserModel.updateUserById(existingUser.id, { googleId });
      }
      return existingUser;
    }

    const password = setCryptoPassword(
      Buffer.from(FAKE_PASS, 'base64').toString(),
    );

    const user = await UserModel.createUser({
      email,
      password: password.toString(),
      displayName: name,
      googleId,
      verified: true,
    });

    return user;
  }
}

export default AuthService;
