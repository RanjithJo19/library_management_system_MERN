const mongoose = require('mongoose');

const issuedBookSchema = {

    username: {
        type: String,
        required: true
    },
    bookId: {
        type: Number,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    issuedDate: {
        type: Date,
        required: false,
        default: Date.now(),
    },
    returnDate: {
        type: Date,
        required: false,
        default: Date.now() + 7*24*60*60*1000,
    },
    userBookCount: {
        type: Number,
        required: false
    },
    fineAmount: {
        type: Number,
        default: 0,
        required: false
    },
    status: {
        type: String,
        enum: ['Issued', 'Returned', 'Approved', 'Request'],
        required: false
    }

};

const IssuedBook = new mongoose.model("IssuedBook", issuedBookSchema);

module.exports = IssuedBook;