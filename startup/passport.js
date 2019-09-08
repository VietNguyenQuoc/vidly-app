const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/google-user');


passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  // const user = 'a'
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: "601934133276-hn0d3oo31teb0rtjgdejrl49qfin5ffc.apps.googleusercontent.com",
  clientSecret: "y3LuRQQDztiAcaLU0Hal6OUo",
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



