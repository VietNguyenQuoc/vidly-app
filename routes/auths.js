const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { Users, authValidate } = require('../models/user');
const path = require('path')

router.post('/', async (req, res) => {
  const { error } = authValidate(req.body);

  if (error) res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });

  if (!user) res.status(400).send('Invalid user or password');

  const result = await bcrypt.compare(req.body.password, user.password);

  if (!result) res.status(400).send('Invalid user or password');

  if (user.verified !== true)
    return res.status(403)
      .send("Your account has not been verified yet. Please check the email for the verification link.")

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;