import { Algorithm, verify, sign, decode } from 'jsonwebtoken';
import AuthError from '../errors/AuthError';
import { JWT_SECRET } from './envConstants';

enum duration {
  verification = '10d',
  access = '1h',
  refresh = '120d',
}

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
      throw new AuthError('unauthorized request');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  decodeToken(token: string): any {
    try {
      return decode(token);
    } catch (err) {
      throw new AuthError('unauthorized request');
    }
  }
}

export const verificationToken = new Token(duration.verification);

export const accessToken = new Token(duration.access);
export const refreshToken = new Token(duration.refresh);
