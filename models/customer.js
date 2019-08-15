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

function customerValidate(customer) {
    const schema = {
        name: Joi.string().required().min(6).max(50),
        phone: Joi.string().required().min(5).max(50),
        isGold: Joi.boolean().required()
    }

    return Joi.validate(customer, schema);
}

const Customers = mongoose.model('customer', customerSchema);

exports.Customers = Customers;
exports.validate = customerValidate;
exports.customerSchema = customerSchema;