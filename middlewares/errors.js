// eslint-disable-next-line max-classes-per-file
import BadRequestError from './BadRequestError';
import Error2 from './Error2';
// const UnauthorizedError = require('./UnauthorizedError');
import ServerError from './ServerError';

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

export default {
  BadRequestError,
  ItemNotFoundError,
  ServerError,
  UnauthorizedError,
  Error2,
};
