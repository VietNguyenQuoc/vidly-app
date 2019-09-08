const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Buffer = require('buffer').Buffer;
const transporter = require('../startup/gmail-transporter');
const { redisClient } = require('../startup/cache');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({
    email: this.email,
    name: this.name,
    _id: this._id,
    isAdmin: this.isAdmin
  }, config.get('jwtPrivateKey'));
}

userSchema.statics.sendVerify = async function (email) {
  const hostname = 'localhost:3000';
  const encodedEmail = Buffer.from(email).toString('base64');
  const randomCode = crypto.randomBytes(7).toString('base64');
  const verifyUrl = `http://${hostname}/api/users/verify?email=${encodedEmail}&code=${randomCode}`;

  let info = await transporter.sendMail({
    from: '"Cicada 3301" <nonameze@cc33.un>',
    to: 'nqviet157@gmail.com',
    subject: "Verifying new registration",
    text: `Click this link below for verifying the registration: ${verifyUrl}`
  });

  console.log('Email sent: ', info.messageId);
  redisClient.set(encodedEmail, randomCode);
}

const Users = mongoose.model('user', userSchema);

function userValidate(user) {
  const schema = {
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(5).max(50).email(),
    password: Joi.string().required().min(8).max(255),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

function authValidate(user) {
  const schema = {
    email: Joi.string().required().min(5).max(50).email(),
    password: Joi.string().required().min(8).max(255)
  };

  return Joi.validate(user, schema);
}

exports.Users = Users;
exports.userValidate = userValidate;
exports.authValidate = authValidate;