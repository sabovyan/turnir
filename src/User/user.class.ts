import ValidationError from '../errors/ValidationError';
import registerValidationSchema from './registerValidate.schema';
import prisma from '../config/prismaClient';
import RegistrationError from '../errors/registrationError';
import { UserData } from './user.types';

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

    const hasUserWithEmail = await prisma.user.findUnique({
      where: {
        email: this.data.email,
      },
    });

    if (hasUserWithEmail) {
      throw new RegistrationError('😢 This email is already in use!');
    }

    const response = await prisma.user.create({
      data: this.data,
    });

    this.data = response;
  }
}

export default User;
