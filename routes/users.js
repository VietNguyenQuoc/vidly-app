const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { Users, userValidate } = require('../models/user');
const config = require('config');

router.post('/', async (req, res) => {
    const {error} = userValidate(req.body);

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
