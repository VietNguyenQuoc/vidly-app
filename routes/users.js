const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { Users, userValidate } = require('../models/user');
const Buffer = require('buffer').Buffer;
const { redisClient } = require('../startup/cache');

router.get('/verify', async (req, res) => {
  if (!req.query.email) {
    res.status(404).send('Invalid verification.');
  } else
    if (!req.query.code) {
      res.status(404).send('Invalid verification.');
    } else
      if (await redisClient.get(req.query.email) !== req.query.code) {
        res.status(400).send('Bad verification.');
      } else {
        const decodedEmail = Buffer.from(req.query.email, 'base64').toString('ascii');
        user = await Users.findOne({ email: decodedEmail });
        if (!user) return res.status(404).send("Your verifying account has no longer existed in our system.");

        user.verified = true;
        await user.save();

        redisClient.del(req.query.email, () => { });
        res.send("Your verification is succesfully completed.");
      }
})

router.post('/register', async (req, res) => {
  const { error } = userValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User is already registered.');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = new Users({
    email: req.body.email,
    name: req.body.name,
    password: hashed,
    isAdmin: req.body.isAdmin
  });

  await user.save();

  await Users.sendVerify(req.body.email);

  res.send('The verification email has been sent, please check the mailbox.');
})


router.post('/', async (req, res) => {
  const { error } = userValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });

  if (user) return res.status(400).send('User is already registered.');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = new Users({
    email: req.body.email,
    name: req.body.name,
    password: hashed,
    isAdmin: req.body.isAdmin
  });

  await user.save();

  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;
