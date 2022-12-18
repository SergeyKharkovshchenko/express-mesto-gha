const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deletCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).max(100)
      .regex(/https:\/\/.*/),
  }),
}), createCard);

router.delete('/:cardId', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required() }) }), deletCardById);
// .regex(/[A-Fa-f0-9]/)

router.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required().regex(/[A-Fa-f0-9]*/) }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required() }) }), dislikeCard);

module.exports = router;
