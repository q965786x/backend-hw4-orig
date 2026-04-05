const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    lastname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 5,
        unique: true
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    }]
});

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    author: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    year: {
        type: Number,
        required: true,
        min: 1000,
        max: new Date().getFullYear()
    }
});

const User = mongoose.model('user', userSchema);
const Book = mongoose.model('book', bookSchema);

module.exports = { User, Book };