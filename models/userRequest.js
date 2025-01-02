const mongoose = require('mongoose');

const userRequestSchema = {

    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
     },
     userType: {
        type: String,
        default: 'Student',
        required: false
    },
     isAdmin: {
        type: Boolean,
        default: false,
     },
    points: {
        type: Number,
        default: 0,
        required: false
    }
  }

const UserRequest = new mongoose.model("UserRequest", userRequestSchema);

module.exports = UserRequest;