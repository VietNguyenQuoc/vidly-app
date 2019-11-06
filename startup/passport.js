const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/google-user');
const config = require('config');


passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  // const user = 'a'
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: config.get('GOOGLE_CLIENT_ID'),
  clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ googleId: profile.id });
  if (!user) {
    const newUser = new User({
      googleId: profile.id
    });
    await newUser.save();
    done(null, newUser);
  }

  done(null, user);
}));




