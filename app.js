const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');

const app = express();

const ITEM_NOT_FOUND_ERROR = 404;

app.use((req, res, next) => {
  req.user = {
    _id: '638f20bade871b446ae7bb53', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use(bodyParser.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);
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
