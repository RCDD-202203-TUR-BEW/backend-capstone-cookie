const express = require('express');
const Multer = require('multer');
const authControllers = require('../controllers/auth');
// const { MAX_IMAGE_SIZE } = require('../utility/variables');
const isAuthenticated = require('../middleware/isAuthenticated');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { checkToken } = require('../services/passport-setup');

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

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
  }),
  function (req, res) {
    const cookieAge = 14 * 24 * 3600 * 1000;

    const { user } = req;
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        providerId: `google-${user.providerId}`,
        avatar: user.profilePicture,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.SECRET_KEY,
      { expiresIn: '14d' },
      { algorithms: 'HS256' }
    );
    console.log(token);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: cookieAge,
      secure: false,
    });
    //directing to update the customer profile
    res.redirect(`/api/customers/profile/${user.id}`);
  }
);

module.exports = router;
