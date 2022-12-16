/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

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

const ITEM_NOT_FOUND_ERROR = 404;

app.use(bodyParser.json());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).regex(/https:\/\/.*/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);
app.use('/users', checkAuth, routerUsers);
app.use('/cards', checkAuth, routerCards);
app.use(errors());
app.use('*', (req, res, next) => {
  res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'Неизвестная науке ошибка' });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App works, port ${PORT}`);
  });
});
