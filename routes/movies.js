const express = require('express');
const router = express.Router();
const { movieValidate, Movies } = require('../models/movie');
const { Genres } = require('../models/genre');
const ObjectIdValidate = require('../middleware/objectid');

router.get('/', async (req, res) => {
  const movies = await Movies.find().sort({ name: 1 })
  res.send(movies);
})

router.get('/:id', ObjectIdValidate, async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found.');

  res.send(movie);
})

router.post('/', async (req, res) => {
  const { error } = movieValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // find the genre on genres collection
  const genre = await Genres.findById(req.body.genreId);

  const imdbId = req.body.imdbId;

  let imdbMovie, imdbRating;

  if (imdbId) {
    imdbMovie = await Movies.imdbLookup(imdbId);
    imdbRating = imdbMovie.imdbRating;
  }

  const movie = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    imdbId,
    imdbRating
  });

  await movie.save();

  res.send(movie);
})

module.exports = router;


