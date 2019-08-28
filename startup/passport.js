const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuthStrategy;
const User = require("../models/google-user");

passport.use(
  new GoogleStrategy(
    {
      consumerKey:
        "601934133276-hn0d3oo31teb0rtjgdejrl49qfin5ffc.apps.googleusercontent.com",
      consumerSecret: "y3LuRQQDztiAcaLU0Hal6OUo",
      callbackURL: "https://rocky-meadow-71430.herokuapp.com/auth/google/callback"
    },
    async function (profile, done) {
      const user = new User({ googleId: profile.id });

      await user.save();
      return done(null, true);
    })
);
