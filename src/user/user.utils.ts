import bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../config/envConstants';

export const setCryptoPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(Number(BCRYPT_SALT));
  return bcrypt.hashSync(password, salt);
};
