const tokenKey = 'my_secret_token_key';
const JWT = require('jsonwebtoken');
const UnauthorizedError = require('./UnauthorizedError');

function generateToken(payload) {
  return JWT.sign(payload, tokenKey, { expiresIn: '7d' });
}

function decode(token) {
  return JWT.decode(token);
}

function checkToken(res, token, next) {
  if (!token) {
    throw new UnauthorizedError('Пользователь не авторизован');
    // return res.status(401).json({ message: 'Неверный пользователь или пароль' });
  }
  try {
    return JWT.verify(token, tokenKey);
  } catch (err) {
    return next(err);
    // return res.status(401).json({ message: 'Неверный пользователь или пароль' });
  }
}

function checkAuth(req, res, next) {
  const token = req.headers.authorization || req.cookies.jwt;
  const checkResult = checkToken(res, token);

  if (checkResult) {
    return next();
  }
  return res.status(401).json({ message: 'Доступ запрещен' });
  // return res.status(403).json({ message: 'Доступ запрещен' });
}

// eslint-disable-next-line camelcase
module.exports = {
  generateToken, checkToken, checkAuth, decode,
};
