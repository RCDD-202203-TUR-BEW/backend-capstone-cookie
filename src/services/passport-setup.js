const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user').User;
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/redirect',
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ providerId: profile.id }, function (err, user) {
        if (err) return cb(err);
        if (user) {
          console.log(user);
          return cb(null, user);
        } else {
          const newUser = new User({
            provider: profile.provider,
            providerId: profile.id,
            name: profile.displayName,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          });
          newUser.save(function (err) {
            if (err) throw err;
            console.log(newUser);
            return cb(null, newUser);
          });
        }
      });
    }
  )
);

function checkToken(req, res, next) {
  //get authcookie from request
  const token = req.cookies.token;

  //verify token which is in cookie value
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    req.user = decoded;

    next();
  });
}

module.exports = {
  passport,
  checkToken,
};
