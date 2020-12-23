import { Algorithm, verify, sign } from 'jsonwebtoken';
import { JWT_SECRET } from './envConstants';

class Token {
  private static secret: string = JWT_SECRET;
  private static expiresIn: string | number = '1h';
  private static algorithm: Algorithm = 'HS256';

  static create(payload: string): string {
    return sign({ id: payload }, Token.secret, {
      expiresIn: Token.expiresIn,
      algorithm: Token.algorithm,
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static CheckToken(token: string): string | object {
    return verify(token, Token.secret);
  }
}

export default Token;
