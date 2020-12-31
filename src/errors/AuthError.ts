import BaseError, { ErrorName, StatusCode } from './BaseError';

class AuthError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.registration, StatusCode.registration);
  }
}
export default AuthError;
