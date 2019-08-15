const { Users } = require('../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {expect} = require('chai');

it('userSchema.model.generateAuthToken', () => {
  const payload = {
    email: 'a',
    name: 'a',
    _id: mongoose.Types.ObjectId().toHexString(),
    isAdmin: true
  }
  const user = new Users(payload);

  const token = user.generateAuthToken();
  const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  expect(decoded, 'no why fail').to.have.property('email');
})