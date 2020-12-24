import { UserData } from './user.types';
import Token from '../config/token';
import RegistrationError from '../errors/registrationError';
import sgMail, { setMessage } from '../config/sendGrid';
import UserModel from './user.model';

class UserService {
  static async sendMail(
    to: string,
    displayName: string,
    token: string,
  ): Promise<void> {
    // eslint-disable-next-line prettier/prettier
    await sgMail.send(setMessage(to, displayName, token), false, (err) => {
      if (err) {
        throw new RegistrationError('Mailing error');
      }
    });
  }

  static async registerNewUser(data: UserData): Promise<void> {
    let user = await UserModel.getUserByEmail(data.email);
    if (user && user.verified) {
      throw new RegistrationError('this email is already registered');
    }

    if (!user) {
      user = await UserModel.createUser(data);
    }

    const token = Token.create(user.email);
    await UserService.sendMail(user.email, user.displayName, token);
  }

  static async verifyUserEmail(token: string): Promise<void> {
    const verified = Token.decode(token);
    const user = await UserModel.getUserByEmail(verified.email);

    if (!user) {
      throw new RegistrationError('invalid token or email');
    }

    if (user && user.verified) {
      throw new RegistrationError('your email is already verified');
    }

    await UserModel.updateUser(verified.email);
  }
}

export default UserService;
