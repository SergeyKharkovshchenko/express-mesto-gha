/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');

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
  }),
}), createUser);
app.post('/signin', login);
app.use('/users', checkAuth, routerUsers);
app.use('/cards', checkAuth, routerCards);
app.use('*', (req, res, next) => {
  res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'Неизвестная науке ошибка' });
  next();
});
mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    console.log(`App works, port ${PORT}`);
  });
});
