const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
  return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Указан некорректный id' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.name = 'ValidationError') {
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name = 'ValidationError') {
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { user: { _id }, body } = req;
    if (!body.avatar) {
      return res.status(400).send({ message: 'Поле "avatar" должно быть заполнено' });
    }
    const user = await User.findByIdAndUpdate(
      _id,
      body,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'User avatar not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name = 'ValidationError') {
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
