const express = require('express');
const router = express.Router();
const {movieValidate, Movies} = require('../models/movie');
const {Genres} = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movies.find().sort({ name: 1 });

    res.send(movies);
})

router.post('/', async (req, res) => {
    const {error} = movieValidate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    // find the genre on genres collection
    const genre = await Genres.findById(req.body.genreId);

    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        } ,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();

    res.send(movie);
})

module.exports = router;