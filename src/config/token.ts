import { Algorithm, verify, sign, decode } from 'jsonwebtoken';
import { JWT_SECRET } from './envConstants';

enum duration {
  verification = '10d',
  access = 86400000,
  refresh = 864000000,
}

interface TokenInterface {
  create(payload: number): string;
  decodeAndVerify(token: string): any;
  decodeToken(token: string): any;
}

class Token implements TokenInterface {
  private secret: string;
  private algorithm: Algorithm;
  public expiresIn: string | number;

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
