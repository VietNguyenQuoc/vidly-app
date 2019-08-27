const express = require('express');
const router = express.Router();
const {Rentals, rentalValidate} = require('../models/rental');
const {Movies} = require('../models/movie');
const {Customers} = require('../models/customer');

router.get('/', async (req, res) => {
    const rentals = await Rentals.find().select('customerInfo');

    res.send(rentals);
})

router.post('/', async (req, res) => {
    const {error} = rentalValidate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movies.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie out of stock.');

    const rental = await new Rentals({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const result = await rental.save();

    movie.numberInStock--;
    await movie.save();

    res.send(result);
})

module.exports = router;