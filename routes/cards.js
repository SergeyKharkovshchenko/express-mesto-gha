const router = require('express').Router();
const { getAllCards, createCard, deletCardById, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deletCardById);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
