const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

router.get('/me', getUserMe);

module.exports = router;
