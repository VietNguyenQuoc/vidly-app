const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auths = require('../routes/auths');
const returns  = require('../routes/returns');
const error = require('../middleware/error');
const session = require('express-session');

module.exports = function (app) {
  app.use(express.json());
  app.use(session({
    secret: 'love hina',
    cookie: {}
  }));
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auths', auths);
  app.use('/api/returns', returns);
  app.use(error);
}