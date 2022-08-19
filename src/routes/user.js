const express = require('express');

const router = express.Router();
const Multer = require('multer');
const userController = require('../controllers/user');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // no larger than 10mb, you can change as needed.
  },
});

// User endpoints
// getAvatar , deleteAvatar
router.get(
  '/getAvatar/:userId',

  userController.fetchUserAvatar
);

router.delete(
  '/deleteAvatar/:userId',

  userController.deleteUserAvatar
);

router.put(
  '/uploadAvatar/:userId',
  multer.single('avatar'),
  userController.uploadUserAvatar
);

module.exports = router;
