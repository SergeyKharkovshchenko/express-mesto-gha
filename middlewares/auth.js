const tokenKey = 'my_secret_token_key';
const JWT = require('jsonwebtoken');

function generateToken(payload) {
  return JWT.sign(payload, tokenKey, { expiresIn: '7d' });
}

function decode(token) {
  return JWT.decode(token);
}

function checkToken(res, token, next) {
  try {
    if (!token) {
      return res.status(401).json({ message: 'Неверный пользователь или пароль' });
    }
    return JWT.verify(token, tokenKey);
  } catch (err) {
    return next(err);
  }
}

function checkAuth(req, res, next) {
  const token = req.headers.authorization || req.cookies.jwt;
  const checkResult = checkToken(res, token);
  const { _id } = decode(token);
  const payload = { _id };
  req.user = payload;
  if (checkResult) {
    return next();
  }
  return res.status(401).json({ message: 'Доступ запрещен' });
}

module.exports = {
  generateToken, checkToken, checkAuth, decode,
};
