const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auths = require('../routes/auths');
const returns = require('../routes/returns');
const error = require('../middleware/error');
const session = require('express-session');
const authG = require('../routes/passport');
const resize = require('../routes/resize');
const passport = require('passport');
const RedisStore = require('connect-redis')(session);
//const session = require('cookie-session');
const redis = require('redis');
let client = redis.createClient();

module.exports = function (app) {
  app.use(express.json());
  app.use(session({
    store: new RedisStore({
      client,
    }),
    secret: 'love hina',
    name: 'sessionid',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auths', auths);
  app.use('/api/returns', returns);
  app.use('/auth/google', authG);
  app.use('/api/resize', resize);
  app.use(error);
  app.use
}