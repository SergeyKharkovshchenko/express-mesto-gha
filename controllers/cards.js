const Card = require('../models/card');
const { decodeToken } = require('../middlewares/auth');

const BAD_REQUEST = 400;
const ITEM_NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Произошла ошибка в name' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'Card not found' });
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Указан некорректный id' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'Card not found' });
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Указан некорректный id' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const deletCardById = async (req, res) => {
  if (decodeToken(req.header.authorisation)) {
    try {
      const card = await Card.findByIdAndRemove(req.params.cardId, { runValidators: true });
      if (!card) {
        return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'Card not found' });
      }
      return res.json(card);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).json({ message: 'Указан некорректный id' });
      }
      return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
    }
  }

  return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deletCardById,
};
