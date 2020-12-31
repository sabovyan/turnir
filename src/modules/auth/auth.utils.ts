import bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../../config/envConstants';
import ValidationError from '../../errors/ValidationError';
import registerValidationSchema from './registerValidate.schema';
import { UserData } from './auth.types';

export const setCryptoPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(Number(BCRYPT_SALT));
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (
  password: string,
  dbPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, dbPassword);
};

export const validateFields = (data: UserData): void => {
  const { error } = registerValidationSchema.validate(data);

  if (error) {
    const name = error.details[0].context?.label;
    throw new ValidationError(`${name} is not valid`);
  }
};
