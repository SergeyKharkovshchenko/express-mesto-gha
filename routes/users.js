const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().regex(/[A-Fa-f0-9]+/),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https{0,1}:\/\/.*/),
  }),
}), updateAvatar);
router.use(errors());

module.exports = router;
