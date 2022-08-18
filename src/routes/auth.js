const express = require('express');
const passport = require('passport');
const signJWT = require('../helpers/signJWT');
const authControllers = require('../controllers/auth');
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
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/error',
  }),
  async (req, res) => {
    const { user } = req;
    signJWT(res, user);

    res.json({ message: 'facebook auth success' });
  }
);

module.exports = router;
