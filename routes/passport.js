const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', passport.authenticate('google', { scope: ['profile'] }));

router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/api/genres',
  successRedirect: '/api/movies'
}));

module.exports = router;