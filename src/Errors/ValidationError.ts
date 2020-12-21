import BaseError, { ErrorName } from './BaseError';

class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.ValidationError, 400);
  }
}

export default ValidationError;
