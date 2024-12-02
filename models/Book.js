const mongoose = require('mongoose');

const bookSchema = {

    name: {
        type: String,
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
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Biographies', 'Short stories', 'Plays', 'Mystery', 'War'],
        required: true
    }

}

const Book = new mongoose.model("Book", bookSchema);

module.exports = Book;