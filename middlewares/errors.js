// import Error2 from './Error2';
// import UnauthorizedError from './UnauthorizedError';
// import ServerError from './ServerError';
// import BadRequestError from './BadRequestError';
// import ItemNotFoundError from './ItemNotFoundError';
const BadRequestError = require('./BadRequestError').default;
const ServerError = require('./ServerError').default;
const UnauthorizedError = require('./UnauthorizedError').default;
// const ItemNotFoundError = require('../middlewares/errors').default;

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
  UnauthorizedError,
};
