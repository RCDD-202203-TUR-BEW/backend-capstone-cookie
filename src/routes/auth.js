const express = require('express');
const authControllers = require('../controllers/auth');
const isAuthenticated = require('../middleware/isAuthenticated');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// router.post('/signup', authControllers.signup);
// router.post('/signin', authControllers.signin);
// router.get('/signout', authControllers.signout);
// router.get('/fetchall', authControllers.fetchAll);

router.post('/auth/signup', authControllers.signup);
router.post('/auth/login', authControllers.signin);
router.get('/auth/signout', isAuthenticated, authControllers.signout);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const cookieAge = 14 * 24 * 3600; // 14 days converted to seconds
    const { _id, name, email, providerId, profilePicture } = req.user;
    const payload = {
      name,
      email,
      providerId,
      avatar: profilePicture,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: cookieAge,
      subject: _id.toString(),
    });

    res.cookie('_t', token, {
      maxAge: cookieAge * 1000,
      httpOnly: true,
      signed: true,
    });

    res.status(302).redirect('/');

    // res.send('you reached the redirect URI');
  }
);

router.get('/signout', (req, res) => {
  res.clearCookie('_t');
  res.status(200).json({ success: true });
});

module.exports = router;
