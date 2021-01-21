import { Algorithm, verify, sign, decode } from 'jsonwebtoken';
import AuthError from '../errors/AuthError';
import { JWT_SECRET } from './envConstants';

enum duration {
  verification = 60 * 60 * 24, // 1day 60 * 60 * 24
  access = 3 * 60, //  <- 3min,
  refresh = 10 * 60 * 60 * 24, // 10days
}

interface TokenInterface {
  create(payload: number): string;
  decodeAndVerify(token: string): any;
  decodeToken(token: string): any;
}

class Token implements TokenInterface {
  private secret: string;
  private algorithm: Algorithm;
  public expiresIn: number;

  constructor(timing: number, algorithm: Algorithm = 'HS256') {
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
      return { err };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  decodeToken(token: string): any {
    try {
      return decode(token);
    } catch (err) {
      return { err };
    }
  }
}

export const verificationToken = new Token(duration.verification);

export const accessToken = new Token(duration.access);
export const refreshToken = new Token(duration.refresh);
