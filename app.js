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
app.use(
  '/users',
  (req, res, next) => {
    try {
      checkAuth(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  routerUsers,
);
app.use(
  '/cards',
  (req, res, next) => {
    try {
      checkAuth(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  routerCards,
);
// app.use(errors());
app.use('*', (req, res, next) => next(new ItemNotFoundError('Неверный запрос')));
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
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

// app.use('*', (req, res, next) => {
//   res.status(404).json({ message: 'Неизвестная науке ошибка' });
//   next();
// });

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App works, port ${PORT}`);
  });
});
