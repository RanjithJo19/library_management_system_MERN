const mongoose = require('mongoose');

const bookSchema = {

    name: {
        type: String,
        unique: true,
        required: true
    },
    bookId: {
        type: Number,
        unique: true,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Biographies', 'Short stories', 'Plays', 'Mystery', 'War', 'Poem'],
        required: true
    }

}

const Book = new mongoose.model("Book", bookSchema);

module.exports = Book;