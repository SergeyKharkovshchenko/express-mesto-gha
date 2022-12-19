class Error2 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = { Error2 };
