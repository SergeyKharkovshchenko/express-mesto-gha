const tokenKey = 'my_secret_token_key';
const JWT = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors').default;

function generateToken(payload) {
  return JWT.sign(payload, tokenKey, { expiresIn: '7d' });
}

function decode(token) {
  return JWT.decode(token);
}

function checkToken(res, token, next) {
  try {
    return JWT.verify(token, tokenKey);
  } catch (err) {
    return next(err);
  }
}

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization || req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError('Неверный пользователь или пароль');
    }
    const checkResult = checkToken(res, token);
    if (checkResult) {
      const payload = decode(token);
      req.user = payload;
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  generateToken, checkToken, checkAuth, decode,
};
