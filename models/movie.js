const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { Genres, genreSchema } = require('./genre');
const unirest = require('unirest');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    min: 0
  },
  imdbId: String,
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  }
});

movieSchema.statics.imdbLookup = function (id) {

  return new Promise((resolve, reject) => {
    unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/")
      .query({
        i: id,
        r: "json"
      })
      .headers({
        "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
        "x-rapidapi-key": "fdb84c8221mshefff87fc0709190p12a8bdjsnad63e05a4231"
      })
      .end(response => {
        if (response.error) reject(response.error);
        resolve(response.body);
      });
  });
}

const Movies = mongoose.model('movie', movieSchema);

function movieValidate(movie) {
  const schema = {
    title: Joi.string().required().min(3).max(255),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(255),
    imdbId: Joi.string().min(0).max(255)
  };

  return Joi.validate(movie, schema);
}



exports.Movies = Movies;
exports.movieValidate = movieValidate;
exports.movieSchema = movieSchema;