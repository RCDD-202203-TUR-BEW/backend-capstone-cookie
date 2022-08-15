const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user').User;
require('dotenv').config();

const googleConfigs = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/redirect',
};

const afterGoogleSignin = async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await createGoogleUser(profile);
    }

    cb(null, user.toJSON());
  } catch (err) {
    cb(err, null);
  }
};

async function createGoogleUser(profile) {
  const user = await User.create({
    email: profile.emails[0].value,
    name: profile.displayName,
    firstname: profile.name?.givenName,
    lastname: profile.name?.familyName,
    avatar: profile.photos?.shift().value,
    provider: profile.provider,
    providerId: profile.id,
  });

  return user;
}

function initGooglePassport() {
  const strategy = new GoogleStrategy(googleConfigs, afterGoogleSignin);

  passport.use(strategy);

  return passport.initialize();
}

module.exports = initGooglePassport;
