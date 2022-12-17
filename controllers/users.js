const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { BadRequestError, ItemNotFoundError, ServerError } = require('../middlewares/errors');
const { generateToken, decode } = require('../middlewares/auth');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(new ServerError('Произошла ошибка'));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      // throw new ItemNotFoundError('User not found');
      throw new BadRequestError('!!!');
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
  const token = req.headers.authorization || req.cookies.jwt;
  const { _id } = decode(token);
  try {
    const user = await User.findById(_id);
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
  const existingUserCheck = await User.findOne({ email: req.body.email });
  if (existingUserCheck) { return res.status(409).json({ message: 'Пользователь с таким емейлом существует' }); }
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      password: hash,
    });
    return res.status(201).json({
      name: user.name,
      avatar: user.avatar,
      about: user.about,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Вы пытаетесь зарегистрироваться по уже существующему в базе email' });
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.jwt;
    const { _id } = decode(token);
    const {
      body,
    } = req;
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
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
    const token = req.headers.authorization || req.cookies.jwt;
    const { _id } = decode(token);
    const {
      body,
    } = req;
    if (!body.avatar) {
      throw new BadRequestError('Поле avatar должно быть заполнено');
    }
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError('User avatar not found');
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Неверный пользователь или пароль' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(403).json({ message: 'Неверный пользователь или пароль' });
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
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
