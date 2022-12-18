const Card = require('../models/card');
const { BadRequestError, ItemNotFoundError } = require('../middlewares/errors');
// const { decode } = require('../middlewares/auth');

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
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
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
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ItemNotFoundError('Card not found'));
      // throw new ItemNotFoundError('Card not found');
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const deletCardById = async (req, res, next) => {
  try {
    const cardCheck = await Card.findById(req.params.cardId);
    if (!cardCheck) {
      throw new ItemNotFoundError('Card not found');
    }
    if (cardCheck.owner.value === req.user._id) {
      const card = await Card.findByIdAndRemove(req.params.cardId, { runValidators: true });
      return res.json(card);
    }
    return res.status(403).json({ message: 'Только владелец может удалить карточку' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deletCardById,
};
