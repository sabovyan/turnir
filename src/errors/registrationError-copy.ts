import BaseError, { ErrorName, StatusCode } from './BaseError';

class RegistrationError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.registration, StatusCode.registration);
  }
}
export default RegistrationError;
