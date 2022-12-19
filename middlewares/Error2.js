class Error2 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = { Error2 };
