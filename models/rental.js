const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rentals = mongoose.model('rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }),
        required: true
    },
    dateOut: {
      type: Date,
      default: Date.now(),
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number
    }
}));

function rentalValidate(rental) {
    const schema = {
        customerId: Joi.objectId(),
        movieId: Joi.objectId()
    };
    return Joi.validate(rental, schema);
}

exports.Rentals = Rentals;
exports.rentalValidate = rentalValidate;