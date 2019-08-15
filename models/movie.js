const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {Genres, genreSchema} = require('./genre');

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
    }
});

const Movies = mongoose.model('movie', movieSchema);

function movieValidate (movie) {
    const schema = {
        title: Joi.string().required().min(3).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    };

    return Joi.validate(movie, schema);
}

async function createMovie(title, genre) {
    const movie = await new Movies({
        title,
        genre,
        numberInStock: 0,
        dailyRentalRate: 0
    });

    await movie.save();
}

// createMovie("Lion King", new Genres({
//     name: 'Animation'
// }));

exports.Movies = Movies;
exports.movieValidate = movieValidate;
exports.movieSchema = movieSchema;