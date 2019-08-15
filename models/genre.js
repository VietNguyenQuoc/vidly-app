const Joi = require('joi');
const mongoose = require('mongoose');

//Set up the schema - shape of a document
const genreSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

//Connect to a collection
const Genres = mongoose.model('genre', genreSchema);

function genreValidate(genre) {
    const schema = {
        name: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(genre, schema);
}

exports.Genres = Genres;
exports.genreSchema = genreSchema;
exports.genreValidate = genreValidate;
