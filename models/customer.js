const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        required: true
    }
});

function customerValidateNew(customer) {
    const schema = {
        name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(5).max(50),
        isGold: Joi.boolean().required()
    }

    return Joi.validate(customer, schema);
}

function customerValidateUpdate(customer) {
  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(50),
    phone: Joi.string().min(5).max(50),
    isGold: Joi.boolean()
  }).or('name', 'phone', 'isGold');

  return Joi.validate(customer, schema);
}

const Customers = mongoose.model('customer', customerSchema);

exports.Customers = Customers;
exports.validateNew = customerValidateNew;
exports.validateUpdate = customerValidateUpdate;
exports.customerSchema = customerSchema;