import ValidationError from '../errors/ValidationError';
import registerValidationSchema from './registerValidate.schema';
import { UserData } from './user.types';
import { createUser, sendMail } from './user.service';

interface UserInterface {
  validate: () => void;
  register: () => Promise<void>;
}

class User implements UserInterface {
  data: UserData;

  constructor(email: string, password: string, userName: string) {
    this.data = {
      email,
      password,
      userName,
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
    this.data = response;
  }
}

export default User;
