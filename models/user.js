const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

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
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        email: this.email,
        name: this.name,
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
}


const Users = mongoose.model('user', userSchema); 

function userValidate (user) {
    const schema = {
        name: Joi.string().min(5).max(50),
        email: Joi.string().required().min(5).max(50).email(),
        password: Joi.string().required().min(8).max(255)
    };

    return Joi.validate(user, schema);
}

exports.Users = Users;
exports.userValidate = userValidate;