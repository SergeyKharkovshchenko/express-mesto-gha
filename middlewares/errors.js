const BadRequestError = require('./BadRequestError');
const ItemNotFoundError = require('./ItemNotFoundError');
const ServerError = require('./ServerError');

// // eslint-disable-next-line max-classes-per-file
// class ItemNotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'ItemNotFoundError';
//     this.statusCode = 404;
//   }
// }

// class BadRequestError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'BadRequestError';
//     this.statusCode = 400;
//   }
// }

// class ServerError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'ServerError';
//     this.statusCode = 500;
//   }
// }

module.exports = {
  BadRequestError, ItemNotFoundError, ServerError,
};
