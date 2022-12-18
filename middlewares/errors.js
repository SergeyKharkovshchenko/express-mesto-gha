const BadRequestError = require('./BadRequestError');
const ServerError = require('./ServerError');

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
};
