import ValidationError from '../errors/ValidationError';
import registerValidationSchema from './registerValidate.schema';
import { UserData } from './user.types';
import { createUser, sendMail } from './user.service';
import Token from '../config/token';

interface UserInterface {
  validate: () => void;
  register: () => Promise<void>;
}

class User implements UserInterface {
  data: UserData;

  constructor(email: string, password: string, displayName: string) {
    this.data = {
      email,
      password,
      displayName,
    };
  }

  validate(): void {
    const { error } = registerValidationSchema.validate(this.data);
    if (error) {
      throw new ValidationError(error.message);
    }
  }

  async register(): Promise<void> {
    this.validate();

    const response = await createUser(this.data);

    const token = Token.create(response.displayName);
    await sendMail('sargis@simplytechnologies.net', 'sargis', token);
  }
}

export default User;
