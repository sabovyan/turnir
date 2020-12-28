import { User } from '@prisma/client';
import { UserData } from './auth.types';
import { verificationToken } from '../../config/token';
import RegistrationError from '../../errors/registrationError';
import sgMail, { setMessage } from '../../config/sendGrid';
import UserModel from '../user/user.model';
import { setCryptoPassword } from './auth.utils';

type dataForVerifying = {
  verified: boolean;
};

class AuthService {
  static async registerNewUser(data: UserData): Promise<void> {
    const existingUser = await UserModel.getUserByEmail(data.email);
    if (existingUser) {
      throw new RegistrationError('this email is already registered');
    }

    const dataWithCryptedPassword: UserData = {
      ...data,
      password: setCryptoPassword(data.password),
    };

    const newUser = await UserModel.createUser(dataWithCryptedPassword);

    const token = verificationToken.create(newUser.id);

    await AuthService.sendMail(newUser.email, newUser.displayName, token);
  }

  static async sendMail(
    to: string,
    displayName: string,
    token: string,
  ): Promise<void> {
    await sgMail.send(setMessage(to, displayName, token), false, (err) => {
      if (err) {
        throw new RegistrationError('Mailing error');
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
    const verified = verificationToken.decodeAndVerify(token);

    const user = await UserModel.getUserById(verified.id);

    if (!user) {
      throw new RegistrationError('invalid token or email');
    }

    if (user.verified) {
      throw new RegistrationError('your email is already verified');
    }

    await AuthService.updateVerificationStatus(user.id, { verified: true });
  }

  static async resendEmail(email: string): Promise<void> {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw new RegistrationError('your email is not registered');
    }

    if (user.verified) {
      throw new RegistrationError('your email is already verified');
    }

    const token = verificationToken.create(user.id);

    await AuthService.sendMail(user.email, user.displayName, token);
  }
}

export default AuthService;
