const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (err) {
    const errors = Object.values(err.errors).map((err) => err.message);
    if (err.name = 'ValidationError') {
      return res.status(400).json({ message: 'Произошла ошибка в name' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    if (req.params.cardId == '') {
      return res.status(400).send({ message: 'Поле "id карты" должно быть заполнено' });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Указан некорректный id' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    if (req.params.cardId == '') {
      return res.status(400).send({ message: 'Поле "id карты" должно быть заполнено' });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Указан некорректный id' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const deletCardById = async (req, res) => {
  try {
    if (req.params.cardId === '') {
      return res.status(400).send({ message: 'Поле "id карты" должно быть заполнено' });
    }
    const card = await Card.findByIdAndRemove(req.params.cardId, { runValidators: true });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Указан некорректный id' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deletCardById,
};
