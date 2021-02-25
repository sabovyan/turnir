import BaseError, { ErrorName, StatusCode } from './BaseError';

class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, ErrorName.badRequest, StatusCode.badRequest);
  }
}
export default BadRequestError;
