// import Error2 from './Error2';
const { Error2 } = require('./Error2');
// const UnauthorizedError = require('./UnauthorizedError');
// import ServerError from './ServerError';
const { ServerError } = require('./ServerError');
const { BadRequestError } = require('./BadRequestError');

// class UnauthorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'UnauthorizedError';
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
  BadRequestError,
  ItemNotFoundError,
  ServerError,
  // UnauthorizedError,
  Error2,
};
