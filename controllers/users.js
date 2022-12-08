const User = require('../models/user');

const BAD_REQUEST = 400;
const ITEM_NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Указан некорректный id' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(BAD_REQUEST).json({ message: errors.join(', ') });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user: { _id }, body } = req;
    const user = await User.findByIdAndUpdate(
      _id,
      body,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(BAD_REQUEST).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { user: { _id }, body } = req;
    if (!body.avatar) {
      return res.status(BAD_REQUEST).send({ message: 'Поле "avatar" должно быть заполнено' });
    }
    const user = await User.findByIdAndUpdate(
      _id,
      body,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(ITEM_NOT_FOUND_ERROR).json({ message: 'User avatar not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(BAD_REQUEST).json({ message: errors.join(', ') });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
