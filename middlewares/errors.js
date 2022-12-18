// eslint-disable-next-line max-classes-per-file
const BadRequestError = require('./BadRequestError');
const ServerError = require('./ServerError');
// const UnauthorizedError = require('./UnauthorizedError');

// class UnauthorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 401;
//   }
// }

class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ItemNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = {
  BadRequestError, ItemNotFoundError, ServerError,
  // UnauthorizedError,
};
