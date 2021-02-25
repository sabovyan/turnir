// eslint-disable-next-line max-classes-per-file

export default class BaseError extends Error {
  code: number;

  constructor(message: string, name: string, code: number) {
    super();
    this.code = code;
    this.message = message;
    this.name = name;

    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export enum ErrorName {
  validation = 'VALIDATION ERROR',
  registration = 'REGISTRATION ERROR',
  authorization = 'AUTHORIZATION ERROR',
  badRequest = 'BAD REQUEST',
}

export enum StatusCode {
  ok = 200,
  validation = 400,
  registration = 401,
  authorization = 403,
  badRequest = 400,
}
