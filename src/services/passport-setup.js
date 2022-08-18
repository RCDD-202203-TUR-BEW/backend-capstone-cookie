const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const Users = require('../models/user').User;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }
  )
);
