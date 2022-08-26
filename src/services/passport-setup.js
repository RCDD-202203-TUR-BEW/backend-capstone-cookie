const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { User, Chef, Customer } = require('../models/user');

const userGoogleStrategy = (userType) =>
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3000/api/auth/google/${userType}/redirect`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const providerId = `google-${profile.id}`;
      let [username] = profile.emails[0].value.split('@');
      username = username.slice(0, 20);
      const { provider } = profile;
      const firstname = profile.name.givenName;
      const lastname = profile.name.familyName;
      const email = profile.emails[0].value;
      const avatar = profile.photos[0].value;

      let user = await User.findOne({ providerId });
      if (!user) {
        if (userType === 'chef') {
          user = await Chef.create({
            provider,
            providerId,
            firstname,
            lastname,
            username,
            phone: null,
            kitchen_name: username,
            role: userType,
            email,
            avatar,
          });
        } else {
          user = await Customer.create({
            provider,
            providerId,
            firstname,
            lastname,
            username,
            phone: null,
            role: userType,
            email,
            avatar,
          });
        }
        cb(null, user);
      } else {
        cb('a user with this email already existed');
      }
    }
  );

// two separate strategies to assign the user role and redirect them correctly
passport.use('customer', userGoogleStrategy('customer'));
passport.use('chef', userGoogleStrategy('chef'));

module.exports = passport;
