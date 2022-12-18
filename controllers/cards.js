const Card = require('../models/card');
const { BadRequestError, ItemNotFoundError } = require('../middlewares/errors');
const { decode } = require('../middlewares/auth');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const token = req.headers.authorization || req.cookies.jwt;
    const { _id } = decode(token);
    const card = await Card.create({ name, link, owner: _id });
    return res.json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.jwt;
    const { _id } = decode(token);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new ItemNotFoundError('Card not found');
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.jwt;
    const { _id } = decode(token);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: _id } }, // убрать _id из массива
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new ItemNotFoundError('Card not found');
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
const deletCardById = async (req, res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;
  if (token) {
    try {
      const { _id } = decode(token);
      const cardCheck = await Card.findById(req.params.cardId);
      if (!cardCheck) {
        throw new ItemNotFoundError('Card not found');
      }
      // eslint-disable-next-line eqeqeq
      if (cardCheck.owner != _id) {
        return res.status(403).json({ message: 'Только владелец может удалить карточку' });
      }
      const card = await Card.findByIdAndRemove(req.params.cardId, { runValidators: true });
      return res.json(card);
    } catch (err) {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Указан некорректный id'));
      }
      return next(err);
    }
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deletCardById,
};
