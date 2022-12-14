const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { ItemNotFoundError, BadRequestError, UnauthorizedError } = require('../middlewares/errors');
const { generateToken } = require('../middlewares/auth');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new ItemNotFoundError('Юзера с таким айди не существует');
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ItemNotFoundError('User not found');
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    return res.status(201).json({
      name: user.name,
      avatar: user.avatar,
      about: user.about,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Вы пытаетесь зарегистрироваться по уже существующему в базе email' });
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      // runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError('User not found');
    }
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError('User avatar not found');
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверный пользователь или пароль');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedError('Неверный пользователь или пароль');
    }
    const payload = { _id: user._id };
    const token = generateToken(payload);
    return res.cookie('jwt', token, {
      maxAge: 3600000,
      // httpOnly: true,
      sameSite: true,
    })
      .json({ message: 'Авторизация прошла успешно' });
  } catch (err) {
    return next(err);
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
