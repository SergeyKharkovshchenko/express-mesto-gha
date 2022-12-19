// eslint-disable-next-line max-classes-per-file, import/no-unresolved, import/extensions
const { BadRequestError } = require('./badReqError');

// class BadRequestError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 400;
//   }
// }

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ItemNotFoundError';
    this.statusCode = 404;
  }
}

class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessDeniedError';
    this.statusCode = 403;
  }
}

export default {
  BadRequestError,
  ItemNotFoundError,
  ServerError,
  UnauthorizedError,
  AccessDeniedError,
};
