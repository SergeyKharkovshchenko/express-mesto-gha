const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '638f20bade871b446ae7bb53', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', (req, res, next) => {
  res.status(404).json({ message: 'Неизвестная науке ошибка' });
  next();
});
mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App works, port ${PORT}`);
  });
});
