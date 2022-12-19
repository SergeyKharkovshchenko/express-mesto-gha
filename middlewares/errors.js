import Error2 from './Error2';
import UnauthorizedError from './UnauthorizedError';
import ServerError from './ServerError';
import BadRequestError from './BadRequestError';
import ItemNotFoundError from './ItemNotFoundError';

// class UnauthorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'UnauthorizedError';
//     this.statusCode = 401;
//   }
// }

// class ItemNotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'ItemNotFoundError';
//     this.statusCode = 404;
//   }
// }

export default {
  BadRequestError,
  ItemNotFoundError,
  ServerError,
  UnauthorizedError,
  Error2,
};
