const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
    },
    published: {
        type: Number,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);