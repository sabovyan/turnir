import BaseError, { ErrorName, StatusCode } from './BaseError';

class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.validation, StatusCode.validation);
  }
}

export default ValidationError;
