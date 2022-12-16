const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserMe);
router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().required().min(3).max(30) }) }), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).regex(/https:\/\/.*/),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).regex(/https:\/\/.*/),
  }),
}), updateAvatar);

module.exports = router;
