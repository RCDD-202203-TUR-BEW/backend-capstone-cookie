const express = require('express');
const Multer = require('multer');
const authControllers = require('../controllers/auth');
// const { MAX_IMAGE_SIZE } = require('../utility/variables');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // no larger than 10mb, you can change as needed.
  },
});

const {
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
} = require('../middleware/validation');

const router = express.Router();

router.post(
  '/customer/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
  authControllers.signup
);

router.post(
  '/chef/signup/:id/avatar',
  multer.single('avatar'),
  authControllers.uploadAvatarImage
);
router.post(
  '/customer/signup/:id/avatar',
  multer.single('avatar'),
  authControllers.uploadAvatarImage
);

router.post(
  '/chef/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
  authControllers.signup
);

router.post('/signin', authControllers.signin);
router.get('/signout', authControllers.signout);
router.post('/verify', authControllers.verifyEmail);

module.exports = router;
