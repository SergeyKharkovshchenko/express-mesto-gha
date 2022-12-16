const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getAllCards, createCard, deletCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(/https:\/\/.*/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({ params: Joi.object().keys({ cardId: Joi.string().min(24) }) }), deletCardById);

router.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().min(24) }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().min(24) }) }), dislikeCard);

router.use(errors());
module.exports = router;
