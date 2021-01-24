import { User } from '@prisma/client';
import {
  ChangePasswordData,
  LoginResponse,
  ResetPassword,
  ResponseUser,
  setNewPassWordData,
  UserData,
} from './auth.types';
import { verificationToken } from '../../config/token';
import AuthError from '../../errors/AuthError';
import sgMail, {
  setMessage,
  setResetPasswordMessage,
} from '../../config/sendGrid';
import UserModel from '../user/user.model';
import {
  comparePassword,
  getAccessAndRefreshTokens,
  setCryptoPassword,
  setResponseUser,
  validatePassword,
} from './auth.utils';
import { getLanguage, Language } from '../../lang/lang';
import { FAKE_PASS } from '../../config/envConstants';

type dataForVerifying = {
  verified: boolean;
};

type TokenInfo = {
  verificationToken: string;
};

class LocalAuthService {
  async register(data: UserData, lang: Language): Promise<User> {
    const existingUser = await UserModel.getUserByEmail(data.email);
    if (existingUser) throw new AuthError('This email is already registered');

    const dataWithCryptedPassword: UserData = {
      ...data,
      password: setCryptoPassword(data.password),
    };

    const newUser = await UserModel.createUser(dataWithCryptedPassword);

    const token = verificationToken.create(newUser.id);

    await this.addVerificationTokenToUser(newUser.id, {
      verificationToken: token,
    });

    const language = getLanguage(lang);

    const to = newUser.email;
    const header = `${language.header} ${newUser.displayName}`;
    const { verifyButtonText } = language;
    const { verifyMessage } = language;

    await this.sendMail(to, header, verifyMessage, token, verifyButtonText);

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
    header: string,
    message: string,
    token: string,
    buttonText: string,
  ): Promise<void> {
    await sgMail.send(
      setMessage(to, header, token, message, buttonText),
      false,
      (err) => {
        if (err) {
          throw new AuthError('Mailing error');
        }
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  updateVerificationStatus(id: number, data: dataForVerifying): Promise<User> {
    return UserModel.updateUserById(id, data);
  }

  async verifyUserEmail(token: string): Promise<void> {
    if (!token) throw new AuthError('Invalid token or email');

    const decoded = verificationToken.decodeAndVerify(token);

    if (decoded === null || decoded === undefined)
      throw new AuthError('Invalid Token');

    if (decoded.err) throw new AuthError(decoded.err.message);

    const user = await UserModel.getUserById(decoded.id);
    if (!user) throw new AuthError('Unauthorized request');

    if (user.verified) throw new AuthError('The email was already registered');

    if (token !== user.verificationToken)
      throw new AuthError('A wrong link is used');

    await this.updateVerificationStatus(user.id, { verified: true });
  }

  async resendEmail(email: string, lang: Language): Promise<void> {
    const user = await UserModel.getUserByEmail(email);

    if (!user) throw new AuthError('Email is not registered');
    if (user.verified) throw new AuthError('The email was already registered');

    const token = verificationToken.create(user.id);

    await this.addVerificationTokenToUser(user.id, {
      verificationToken: token,
    });

    const language = getLanguage(lang);

    const to = user.email;
    const header = `${language.header} ${user.displayName}`;
    const { verifyButtonText } = language;
    const { verifyMessage } = language;

    await this.sendMail(to, header, verifyMessage, token, verifyButtonText);
  }

  // eslint-disable-next-line class-methods-use-this
  async loginWithEmail(
    email: string,
    password: string,
  ): Promise<LoginResponse> {
    const user = await UserModel.getUserByEmail(email);

    if (!user) throw new AuthError('Email is not registered');

    if (!user.verified) throw new AuthError('your account is not verified');

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) throw new AuthError('Your password is not correct');

    const tokens = getAccessAndRefreshTokens(user.id);

    const userForResponse: ResponseUser = setResponseUser(user);

    return { ...tokens, user: userForResponse };
  }

  // eslint-disable-next-line class-methods-use-this
  async changePassword(data: ChangePasswordData) {
    if (!data) throw new AuthError('Data is not provided');

    const { id, oldPassword, newPassword } = data;
    const user = await UserModel.getUserById(id);

    if (!user) throw new AuthError('unauthorized Request');

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect)
      throw new AuthError('Your old password is not correct');

    validatePassword(newPassword);

    const hashedPassword = setCryptoPassword(newPassword);

    await UserModel.updateUserById(user.id, {
      password: hashedPassword,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async resetPassword(data: ResetPassword, lang: Language) {
    if (!data) throw new AuthError('Data is not provided');

    const { email } = data;

    const user = await UserModel.getUserByEmail(email);

    if (!user) throw new AuthError('Unauthorized Request');

    if (
      user.googleId ||
      (user.facebookId && comparePassword(FAKE_PASS, user.password))
    ) {
      throw new AuthError('you are not able to change password');
    }

    if (new Date().getTime() - new Date(user.updatedAt).getTime() < 10 * 1000) {
      throw new AuthError('it is prohibited to send several mails at once');
    }

    const language = getLanguage(lang);

    const to = user.email;
    const header = `${language.header} ${user.displayName}`;
    const { buttonText } = language;
    const { message } = language;

    const token = verificationToken.create(user.id);

    await UserModel.updateUserVerificationTokenByEmail(email, token);

    await this.sendResetMail(to, header, buttonText, token, message);
  }

  // eslint-disable-next-line class-methods-use-this
  async sendResetMail(
    to: string,
    header: string,
    buttonText: string,
    token: string,
    message: string,
  ) {
    await sgMail.send(
      setResetPasswordMessage(to, header, buttonText, token, message),
      false,
      (err) => {
        if (err) {
          throw new AuthError('Mailing error');
        }
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async confirmNewPassword(data: setNewPassWordData) {
    const { password, token } = data;
    if (!password || !token) throw new AuthError('Unauthorized Request');

    validatePassword(password);

    const payload = await verificationToken.decodeAndVerify(token);

    const hashedPassword = setCryptoPassword(password);

    if (payload.err) throw new AuthError('Unauthorized Request');

    await UserModel.updateUserById(payload.id, { password: hashedPassword });
  }
}

const localAuthService = new LocalAuthService();

export default localAuthService;
