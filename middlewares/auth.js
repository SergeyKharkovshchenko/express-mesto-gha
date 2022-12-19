const tokenKey = 'my_secret_token_key';
const JWT = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

function generateToken(payload) {
  return JWT.sign(payload, tokenKey, { expiresIn: '7d' });
}

function decode(token) {
  return JWT.decode(token);
}

function checkToken(res, token, next) {
  try {
    if (!token) {
      throw new UnauthorizedError('User not found');
      // return res.status(401).json({ message: 'Неверный пользователь или пароль' });
    }
    return JWT.verify(token, tokenKey);
  } catch (err) {
    return next(err);
  }
}

// eslint-disable-next-line consistent-return
function checkAuth(req, res, next) {
  const token = req.headers.authorization || req.cookies.jwt;
  const checkResult = checkToken(res, token);
  const payload = decode(token);
  req.user = payload;
  if (checkResult) {
    return next();
  }
  // return res.status(401).json({ message: 'Доступ запрещен' });
  next(new UnauthorizedError('User not found'));
}

module.exports = {
  generateToken, checkToken, checkAuth, decode,
};
