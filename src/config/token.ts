import { Algorithm, verify, sign } from 'jsonwebtoken';
import RegistrationError from '../errors/registrationError';
import { JWT_SECRET } from './envConstants';

class Token {
  private secret: string;
  private algorithm: Algorithm;
  private expiresIn: string | number;

  constructor(timing: string | number, algorithm: Algorithm = 'HS256') {
    this.expiresIn = timing;
    this.algorithm = algorithm;
    this.secret = JWT_SECRET;
  }

  create(payload: number): string {
    return sign({ id: payload }, this.secret, {
      expiresIn: this.expiresIn,
      algorithm: this.algorithm,
    });
  }

  decodeAndVerify(token: string): any {
    try {
      return verify(token, this.secret);
    } catch (err) {
      throw new RegistrationError('unauthorized request');
    }
  }
}

export const verificationToken = new Token('1d');
