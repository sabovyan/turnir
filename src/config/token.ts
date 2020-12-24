import { Algorithm, verify, sign } from 'jsonwebtoken';
import RegistrationError from '../errors/registrationError';
import { JWT_SECRET } from './envConstants';

type decodedObject = {
  email: string;
  iat: number;
  exp: number;
};

class Token {
  private static secret: string = JWT_SECRET;
  private static expiresIn: string | number = '1h';
  private static algorithm: Algorithm = 'HS256';

  static create(payload: string): string {
    return sign({ email: payload }, Token.secret, {
      expiresIn: Token.expiresIn,
      algorithm: Token.algorithm,
    });
  }

  static decode(token: string): any {
    try {
      return verify(token, Token.secret);
    } catch (err) {
      throw new RegistrationError('unauthorized request');
    }
  }
}

export default Token;
