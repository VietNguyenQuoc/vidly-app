const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/',
  passport.authenticate('google', { scope: ['profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/api/movies' }),
  function (req, res) {
    res.redirect('/api/genres');
  });

module.exports = router;