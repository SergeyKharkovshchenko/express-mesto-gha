const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    }
    return res.status(200).json(users);
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

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  try {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign, no-shadow
    const errors = Object.values(err.errors).map((err) => err.message);
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign, no-shadow
    const errors = Object.values(err.errors).map((err) => err.message);
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user: { _id }, body } = req;
    const user = await User.findByIdAndUpdate(
      _id,
      body,
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(201).json(user);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign, no-shadow
    const errors = Object.values(err.errors).map((err) => err.message);
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { user: { _id }, body } = req;
    const user = await User.findByIdAndUpdate(
      _id,
      body,
      { new: true },
    );
    if (!user.avatar) {
      return res.status(404).json({ message: 'User avatar not found' });
    }
    return res.status(201).json(user);
  } catch (err) {
    // eslint-disable-next-line no-constant-condition, no-cond-assign, no-shadow
    const errors = Object.values(err.errors).map((err) => err.message);
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if (err.name = 'ValidationError') {
      // eslint-disable-next-line no-shadow
      return res.status(400).json({ message: errors.join(', ') });// 'Произошла ошибка' })
    }

    // eslint-disable-next-line no-undef
    return res.status(500).json({ message: errors.join(', ') });// 'Произошла ошибка' })
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
