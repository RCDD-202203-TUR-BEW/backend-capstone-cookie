const express = require('express');
const authControllers = require('../controllers/auth');
const isAuthenticated = require('../middleware/isAuthenticated');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { checkToken } = require('../services/passport-setup');

router.post('/auth/signup', authControllers.signup);
router.post('/auth/login', authControllers.signin);
router.get('/auth/signout', isAuthenticated, authControllers.signout);

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
