const express = require('express');
const Multer = require('multer');
const passport = require('passport');
const signJWT = require('../helpers/signJWT');
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
  '/uploadAvatar/:username',
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
router.get('/verifyEmail', authControllers.verifyEmail);

router.get(
  '/google/customer',
  passport.authenticate('customer', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/customer/redirect',
  passport.authenticate('customer', {
    session: false,
  }),
  async (req, res) => {
    const { user } = req;
    signJWT(res, user);

    res.json({ message: 'new customer signed up successfully' });
  }
);

router.get(
  '/google/chef',
  passport.authenticate('chef', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/chef/redirect',
  passport.authenticate('chef', {
    session: false,
  }),
  async (req, res) => {
    const { user } = req;

    signJWT(res, user);

    res.json({ message: 'new chef signed up successfully' });
  }
);

module.exports = router;
