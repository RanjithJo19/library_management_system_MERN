const mongoose = require('mongoose');

const userSchema = {

    name: {
        type: String,
        required: [true],
    },
    username: {
        type: String,
        required: [true],
        unique: true
    },
    email: {
        type: String,
        required: [true],
        unique: true
    },
    password: {
        type: String,
        required: [true],
    },
    userType: {
        type: String,
        enum: ['Student', 'Librarian'],
        default: 'Student',
        required: false
    },
    BooKCount: {
        type: Number,
        default: 0,
    },
    fineAmount: {
        type: Number,
        default: 0,
        required: false
    },
    points: {
        type: Number,
        default: 0,
    }
  }


const User = new mongoose.model("User", userSchema);

module.exports = User;