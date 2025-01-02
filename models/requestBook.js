const mongoose = require('mongoose');

const BookRequestSchema = {
    
    username: {
        type : String,
        required: true 
    },
    bookId: {  
        type : Number,
        required: true 
    },
    bookName: {
        type : String,
        required: true 
    },
    author: {
        type : String,
        required: true 
    },
    status: {
        type: String,
        required: false
    }
    
};


const UserBookRequest = new mongoose.model("BookRequest", BookRequestSchema);

module.exports = UserBookRequest;