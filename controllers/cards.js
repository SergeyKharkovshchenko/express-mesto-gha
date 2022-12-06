const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      return res.status(404).json({ message: 'Cards not found' });
    }
    return res.status(200).json(cards);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      console.error(err);
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    return res.status(201).json(card);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      console.error(err);
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // eslint-disable-next-line no-underscore-dangle
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Cards not found' })
    }
    return res.status(200).json(card);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      console.error(err);
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // eslint-disable-next-line no-underscore-dangle
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' })
    }
    return res.status(200).json(card);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      console.error(err);
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const deletCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.status(201).json(card);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      console.error(err);
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deletCardById,
};
