export default class BaseError extends Error {
  code: number;

  constructor(message: string, name: string, code: number) {
    super();
    this.code = code;
    this.message = message;
    this.name = name;
  }
}

export enum ErrorName {
  ValidationError = 'VALIDATION ERROR',
  registrationError = 'REGISTRATION ERROR',
  authenticationError = 'AUTHENTICATION ERROR',
}
