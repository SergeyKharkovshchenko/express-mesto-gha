const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');

// eslint-disable-next-line camelcase
const { generateToken } = require('../middlewares/auth');

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
      return res
        .status(ITEM_NOT_FOUND_ERROR)
        .json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Указан некорректный id' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const getUserMe = async (req, res) => {
  try {
    // const {
    //   user: { email },
    // } = req;
    const user = await User.findById(req.body.email);
    if (!user) {
      return res
        .status(ITEM_NOT_FOUND_ERROR)
        .json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Указан некорректный id' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  if (validator.isEmail(req.body.email)) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        email: req.body.email,
        password: hash,
      });
      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line no-constant-condition, no-cond-assign
      if ((err.name = 'ValidationError')) {
        // eslint-disable-next-line no-shadow
        const errors = Object.values(err.errors).map((err) => err.message);
        return res.status(BAD_REQUEST).json({ message: errors.join(', ') });
      }
      return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
    }
  }
  return res.status(BAD_REQUEST).json({ message: 'Некорректно введен е-мейл' });
};

const updateProfile = async (req, res) => {
  try {
    const {
      user: { _id },
      body,
    } = req;
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res
        .status(ITEM_NOT_FOUND_ERROR)
        .json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if ((err.name = 'ValidationError')) {
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(BAD_REQUEST).json({ message: errors.join(', ') }); // 'Произошла ошибка' })
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const {
      user: { _id },
      body,
    } = req;
    if (!body.avatar) {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Поле avatar должно быть заполнено' });
    }
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res
        .status(ITEM_NOT_FOUND_ERROR)
        .json({ message: 'User avatar not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if ((err.name = 'ValidationError')) {
      // eslint-disable-next-line no-shadow
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(BAD_REQUEST).json({ message: errors.join(', ') });
    }
    return res.status(SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // eslint-disable-next-line no-undef
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json('Неверный пользователь или пароль');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(403).json('Неверный пользователь или пароль');
    }

    // const payload = { _id: user._id, user: user.email };
    const payload = { _id: user._id };
    const token = generateToken(payload);
    return res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })
      .send({ token });
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-constant-condition, no-cond-assign
    if ((err.name = 'ValidationError')) {
      return res.status(BAD_REQUEST).json({ message: 'Ошибка' });
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
  getUserMe,
  login,
};
