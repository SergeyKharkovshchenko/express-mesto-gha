const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { ItemNotFoundError } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');
const { checkAuth } = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');

const app = express();
app.use(cookieParser());

app.use(bodyParser.json());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https:\/\/.*/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use('/users', checkAuth, routerUsers);
app.use('/cards', checkAuth, routerCards);
app.use(errors());
app.use('*', (req, res, next) => next(new ItemNotFoundError('Неверный запрос')));
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode);
  res.json({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  console.log(res);
  next();
});

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    console.log(`App works, port ${PORT}`);
  });
});
