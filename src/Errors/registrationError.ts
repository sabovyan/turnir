import BaseError, { ErrorName } from './BaseError';

class RegistrationError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.registrationError, 401);
  }
}
export default RegistrationError;
